import { AxiosResponse } from 'axios';
import { ServiceCollection, ServiceData } from 'Models';
import { getServiceDetails, getServices } from '../axiosAPIs/serviceAPI';
import { ServiceDataObj } from '../components/Modals/AddServiceModal/AddServiceModal';
import {
  BIGQUERY,
  HIVE,
  MSSQL,
  MYSQL,
  ORACLE,
  POSTGRES,
  REDSHIFT,
  SERVICE_DEFAULT,
  SNOWFLAKE,
} from '../constants/services.const';
import { ServiceType } from '../enums/service.enum';
import { ApiData } from '../pages/services';

export const serviceTypeLogo = (type: string) => {
  switch (type) {
    case ServiceType.MYSQL:
      return MYSQL;

    case ServiceType.REDSHIFT:
      return REDSHIFT;

    case ServiceType.BIGQUERY:
      return BIGQUERY;

    case ServiceType.HIVE:
      return HIVE;

    case ServiceType.POSTGRES:
      return POSTGRES;

    case ServiceType.ORACLE:
      return ORACLE;

    case ServiceType.SNOWFLAKE:
      return SNOWFLAKE;

    case ServiceType.MSSQL:
      return MSSQL;

    default:
      return SERVICE_DEFAULT;
  }
};

export const fromISOString = (isoValue = '') => {
  if (isoValue) {
    // 'P1DT 0H 0M'
    const [d, hm] = isoValue.split('T');
    const day = +d.replace('D', '').replace('P', '');
    const [h, time] = hm.split('H');
    const minute = +time.replace('M', '');

    return { day, hour: +h, minute };
  } else {
    return {
      day: 1,
      hour: 0,
      minute: 0,
    };
  }
};

export const getFrequencyTime = (isoDate: string): string => {
  const { day, hour, minute } = fromISOString(isoDate);

  return `${day}D-${hour}H-${minute}M`;
};

const getAllServiceList = (
  allServiceCollectionArr: Array<ServiceCollection>
): Promise<Array<ServiceDataObj>> => {
  let listArr = [];

  //   fetch services of all individual collection
  return new Promise<Array<ServiceDataObj>>((resolve, reject) => {
    if (allServiceCollectionArr.length) {
      let promiseArr = [];
      promiseArr = allServiceCollectionArr.map((obj) => {
        return getServices(obj.value);
      });
      Promise.all(promiseArr)
        .then((result: AxiosResponse[]) => {
          if (result.length) {
            let serviceArr = [];
            serviceArr = result.map((service) => service?.data?.data || []);
            // converted array of arrays to array
            const allServices = serviceArr.reduce(
              (acc, el) => acc.concat(el),
              []
            );
            listArr = allServices.map((s: ApiData) => {
              return { ...s, ...s.jdbc };
            });
            resolve(listArr);
          } else {
            resolve([]);
          }
        })
        .catch((err) => reject(err));
    } else {
      resolve([]);
    }
  });
};

export const getAllServices = (): Promise<Array<ServiceDataObj>> => {
  return new Promise<Array<ServiceDataObj>>((resolve, reject) => {
    getServiceDetails().then((res: AxiosResponse) => {
      let allServiceCollectionArr: Array<ServiceCollection> = [];
      if (res.data.data?.length) {
        allServiceCollectionArr = res.data.data.map((service: ServiceData) => {
          return {
            name: service.collection.name,
            value: service.collection.name,
          };
        });
      }
      getAllServiceList(allServiceCollectionArr)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  });
};
