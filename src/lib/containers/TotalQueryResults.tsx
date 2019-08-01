import * as React from 'react'
import { QueryResultBundle } from '../utils/jsonResponses/Table/QueryResultBundle'

export type TotalQueryResultsProps = {
  data: QueryResultBundle
  filter?: string
  totalResultsNoFacet?: number
  isLoading: boolean
  style?: React.CSSProperties
  doneLoadingTextFunction:(total: number, loader: JSX.Element ) => JSX.Element | string
  isLoadingTextFunction:  (total: number, loader: JSX.Element ) => JSX.Element | string
}

export const TotalQueryResults: React.FunctionComponent<TotalQueryResultsProps> =
  ({ data, filter, totalResultsNoFacet, isLoading, style, doneLoadingTextFunction, isLoadingTextFunction }) => {
    const { facets = [] } = data
    let total = 0
    if (filter) {
      const curFacetsIndex = facets.findIndex(el => el.facetType === 'enumeration' && el.columnName === filter)
      // calculate the values chosen
      const curFacets = data.facets[curFacetsIndex]
      // edge case -- if they are all false then they are considered all true..
      // sum up the counts of data
      let anyTrue = false
      let totalAllFalseCase = 0
      let totalStandardCase = 0

      if (curFacets) {
        for (const key of curFacets.facetValues) {
          anyTrue = anyTrue || key.isSelected
          totalAllFalseCase += key.count
          totalStandardCase += key.isSelected ? key.count : 0
        }
      }
      total = anyTrue ? totalStandardCase : totalAllFalseCase

      if (data.queryResult.queryResults.rows.length === 0) {
        // we override the statements above if there are zero results because the current UI
        // would be showing zero cards
        total = 0
      }

    } else {
      // If the user isn't drilling down with a facet then we look at the total
      // count passed into the view
      if (!totalResultsNoFacet) {
        throw Error('Error calculating total, did not specify total for unfaceted view')
      }
      total = totalResultsNoFacet
    }
    const loader = <span style={{ marginLeft: '2px' }} className={'spinner'}/> 
    return (
      <p style={style} className="SRC-boldText SRC-text-title SRC-centerContent">
        {!isLoading && doneLoadingTextFunction(total, loader)}
        {isLoading &&  isLoadingTextFunction(total, loader)}
      </p>
    )
  }
