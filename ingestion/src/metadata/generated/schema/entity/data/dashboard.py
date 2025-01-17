# generated by datamodel-codegen:
#   filename:  schema/entity/data/dashboard.json
#   timestamp: 2021-08-23T15:40:00+00:00

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field, constr

from ...type import basic, entityReference, usageDetails


class Dashboard(BaseModel):
    id: basic.Uuid = Field(
        ..., description='Unique identifier that identifies a dashboard instance.'
    )
    name: constr(min_length=1, max_length=64) = Field(
        ..., description='Name that identifies this dashboard.'
    )
    fullyQualifiedName: Optional[constr(min_length=1, max_length=64)] = Field(
        None,
        description="A unique name that identifies a dashboard in the format 'ServiceName.DashboardName'.",
    )
    description: Optional[str] = Field(
        None, description='Description of the dashboard, what it is, and how to use it.'
    )
    href: Optional[basic.Href] = Field(
        None, description='Link to the resource corresponding to this entity.'
    )
    owner: Optional[entityReference.EntityReference] = Field(
        None, description='Owner of this dashboard.'
    )
    service: entityReference.EntityReference = Field(
        ..., description='Link to service where this dashboard is hosted in.'
    )
    usageSummary: Optional[usageDetails.TypeUsedToReturnUsageDetailsOfAnEntity] = Field(
        None, description='Latest usage information for this database.'
    )
