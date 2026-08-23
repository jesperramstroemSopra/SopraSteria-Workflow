# Pattern: Dataverse Web API Queries

> **Architecture track:** Dataverse
> **When to load:** When authoring Dataverse queries from Power Automate, Canvas Apps, Code Apps, or any HTTP client.

---

## Query Surfaces

The same OData query patterns work across all surfaces that call Dataverse:

| Surface | How to call | Notes |
|---|---|---|
| **Power Automate** | List rows (Dataverse connector) | Use Filter rows / OData filter expression |
| **Canvas App** | `Filter(DataSource, ...)` delegable expression | Power Fx compiles to OData |
| **Code Apps / PCF** | `Xrm.WebApi.retrieveMultipleRecords()` | JavaScript client |
| **HTTP action (PA)** | `GET /api/data/v9.2/[entitySetName]` | Direct Web API call |
| **Postman / external** | Bearer token + OData URL | For testing and integration |

---

## OData URL Structure

```
https://[org].crm4.dynamics.com/api/data/v9.2/[entitySetName]
  ?$select=[columns]
  &$filter=[condition]
  &$orderby=[column] asc|desc
  &$top=[n]
  &$expand=[relationship]($select=[columns])
  &$count=true
```

### Entity Set Names

The entity set name (plural) differs from the logical name. Find it at:
`GET /api/data/v9.2/EntityDefinitions?$filter=LogicalName eq 'account'&$select=EntitySetName`

Common names:
| Logical Name | Entity Set Name |
|---|---|
| `account` | `accounts` |
| `contact` | `contacts` |
| `systemuser` | `systemusers` |
| `spr_customtable` | `spr_customtables` |

---

## $select — Always Specify

Never use a query without `$select`. An unfiltered record can return 200+ columns, most irrelevant.

```
?$select=name,emailaddress1,statecode,_primarycontactid_value
```

For lookup columns, the `_[logicalname]_value` convention returns the GUID. To get the display name:
```
?$select=name,_primarycontactid_value
&$expand=primarycontactid($select=fullname,emailaddress1)
```

---

## $filter — Common Patterns

```
// Equality
$filter=statecode eq 0

// Text StartsWith (delegable in Canvas)
$filter=startswith(name,'Acme')

// Contains (use carefully — may not be indexed)
$filter=contains(description,'urgent')

// Date comparison
$filter=createdon ge 2024-01-01T00:00:00Z

// Lookup by GUID
$filter=_ownerid_value eq 'guid-here'

// And / Or
$filter=statecode eq 0 and statuscode eq 1

// In a set of values
$filter=Microsoft.Dynamics.CRM.In(PropertyName='statuscode',PropertyValues=['1','2'])

// Current user
$filter=_ownerid_value eq @me
```

---

## $expand — Relationships

```
// Expand a many-to-one (lookup)
$expand=primarycontactid($select=fullname,emailaddress1)

// Expand a one-to-many (collection)
$expand=contact_customer_accounts($select=fullname;$top=10)

// Nested expand (two levels)
$expand=primarycontactid($select=fullname;$expand=account_primary_contact($select=name))
```

Avoid expanding large collections without a `$top` — this can return thousands of records
for the parent record's children.

---

## FetchXML

FetchXML is an XML-based query language, older but still needed for:
- Advanced link-entity joins
- Aggregations (count, sum, avg, min, max)
- Queries using saved query IDs (system views)

```xml
<fetch top="50">
  <entity name="account">
    <attribute name="name" />
    <attribute name="emailaddress1" />
    <filter>
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
    <link-entity name="contact" from="contactid" to="primarycontactid" alias="c">
      <attribute name="fullname" />
    </link-entity>
  </entity>
</fetch>
```

Convert to URL-encoded string and pass as `?fetchXml=` parameter.

**In Power Automate:** Use `Perform a changeset request` or the FetchXML option in advanced mode of `List rows`.

---

## Aggregation

```xml
<fetch aggregate="true">
  <entity name="opportunity">
    <attribute name="estimatedvalue" alias="totalValue" aggregate="sum" />
    <attribute name="opportunityid" alias="count" aggregate="count" />
    <filter>
      <condition attribute="statecode" operator="eq" value="0" />
    </filter>
  </entity>
</fetch>
```

OData aggregate (newer, preferred for simple cases):
```
?$apply=aggregate(estimatedvalue with sum as totalValue, opportunityid with countdistinct as count)
        &$filter=statecode eq 0
```

---

## Power CAT Dataverse Web API Skill

For complex query generation:
```
Power CAT dataverse-webapi-query skill:
  Natural language → OData URL or FetchXML
  Handles multi-surface targeting
  Validates delegation and performance
```

See: `microsoft/power-cat-skills` → `powercat-dataverse` → `dataverse-webapi-query`.

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| No `$select` | Returns all columns; slow; wastes API quota | Always specify `$select` |
| `$filter=contains(...)` on unindexed text column | Full table scan; degrades with data growth | Use `startswith()` or index the column |
| Loading related records in a loop per parent | N+1 query problem | Use `$expand` on the parent query |
| Ignoring `@odata.nextLink` | Silently returns first page only | Always handle pagination |
| Storing query results without `$select` in a variable | Huge JSON payload; flow timeouts | Select minimum required columns |

---

## Upstream Reference

- **Source:** `microsoft/power-cat-skills` (powercat-dataverse / dataverse-webapi-query), `microsoft/PowerApps-Samples`
- **Accessed:** 2026-Q3
- **Sopra Divergence:** Sopra requires `$select` on all production queries. The Power CAT `dataverse-webapi-query` skill is referenced as a generation accelerator; query output must be reviewed before use.
