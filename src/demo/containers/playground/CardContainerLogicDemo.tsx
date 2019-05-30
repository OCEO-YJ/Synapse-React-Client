import * as React from 'react'
import CardContainerLogic from '../../../lib/containers/CardContainerLogic'
import { SynapseConstants } from 'src/lib'

export default class CardContainerLogicDemo extends React.Component {

  constructor(props: any) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <CardContainerLogic
        type={SynapseConstants.CSBC_DATASET}
        sql={`SELECT * FROM syn18488466 WHERE ( ( "is.dataset" = 'TRUE' ) )`}
        unitDescription="studies"
        loadingBar={
          <div
            style={{ height: 320, width: 320, background: 'green', color: 'white' }}
          >
            I'm loading as fast I can!!
          </div>
        }
      />
    )
  }
}
