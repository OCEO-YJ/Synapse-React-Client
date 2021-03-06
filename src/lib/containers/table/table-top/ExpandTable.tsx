import * as React from 'react'
import ExpandSvg from '../../../assets/icons/expand.svg'
import ShrinkSvg from '../../../assets/icons/shrink.svg'
import { ElementWithTooltip } from '../../widgets/ElementWithTooltip'

type ExpandTableProps = {
  onExpand: Function
  isExpanded: boolean
}

export const ExpandTable: React.FunctionComponent<ExpandTableProps> = props => {
  const { onExpand, isExpanded } = props

  return (
    <>
      <ElementWithTooltip
        idForToolTip={'expand'}
        callbackFn={() => onExpand()}
        tooltipText={
          isExpanded ? 'Shrink table to fit' : 'Expand table in full screen'
        }
        image={{
          svgImg: isExpanded ? ShrinkSvg : ExpandSvg,
          altText: isExpanded ? 'shrink table' : 'expand table',
        }}
      />
    </>
  )
}
