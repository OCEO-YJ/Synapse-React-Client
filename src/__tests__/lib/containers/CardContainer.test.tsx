import * as React from 'react'
import { mount, shallow } from 'enzyme'
import CardContainer, { RowContainer, CardContainerProps } from '../../../lib/containers/CardContainer'
import { SynapseConstants } from '../../../lib'
import syn16787123Json  from '../../../mocks/syn16787123.json'
import { QueryBundleRequest } from 'src/lib/utils/jsonResponses/Table/QueryBundleRequest'
import { QueryResultBundle } from 'src/lib/utils/jsonResponses/Table/QueryResultBundle'

const createShallowComponent = (props: CardContainerProps) => {
  const wrapper = shallow(
    <CardContainer
      {...props}
    />
  )
  return wrapper
}

const createMountedComponent = async (props: CardContainerProps) => {
  const wrapper = await mount(
    <CardContainer
      {...props}
    />)
  const instance = wrapper.instance() as CardContainer
  return { wrapper, instance }
}

describe('it performs all functionality', () => {

  // for our purposes its okay to return the same data again
  const getNextPageOfData = jest.fn((_arg: QueryBundleRequest) => { return Promise.resolve(true) })
  const getLastQueryRequest = jest.fn(() => {
    return  {
      concreteType: 'org.sagebionetworks.repo.model.table.QueryBundleRequest',
      partMask:
        SynapseConstants.BUNDLE_MASK_QUERY_COLUMN_MODELS |
        SynapseConstants.BUNDLE_MASK_QUERY_FACETS |
        SynapseConstants.BUNDLE_MASK_QUERY_RESULTS |
        SynapseConstants.BUNDLE_MASK_QUERY_COUNT
        ,
      query: {
        sql,
        isConsistent: false,
        limit: 25,
        offset: 0,
      }
    }
  })

  const sql = 'SELECT * FROM syn16787123'
  const unitDescription = 'studies'
  const type = SynapseConstants.STUDY
  // cast the data to ignore ts warning
  const data = syn16787123Json as QueryResultBundle
  const props = {
    getNextPageOfData,
    getLastQueryRequest,
    sql,
    unitDescription,
    type,
    data
  }

  it('renders without crashing', () => {
    const tree = createShallowComponent(props)
    expect(tree).toBeDefined()
  })

  it('Renders total and RowContainer correctly without a faceted view', () => {
    const propsWithTotalQueryCount = {
      ...props,
      totalResultsNoFacet: 59
    }
    const wrapper = createShallowComponent(propsWithTotalQueryCount)
    expect(wrapper.find(RowContainer)).toHaveLength(25)
    expect(wrapper.find('p.SRC-boldText.SRC-text-title').text()).toEqual('Displaying 59 studies')
    expect(wrapper.find('button.pull-right').text()).toEqual('View More')
  })

  it('Renders total and RowContainer correctly with a faceted view', () => {
    // inject filter prop
    const wrapper = createShallowComponent({ ...props, filter: 'projectStatus' })
    expect(wrapper.find(RowContainer)).toHaveLength(25)
    expect(wrapper.find('p.SRC-boldText.SRC-text-title').text()).toEqual('Displaying 59 studies')
  })

  it('Loads buffer data correctly', async () => {
    const { wrapper, instance } = await createMountedComponent(props)
    expect(wrapper.state('hasLoadedBufferData')).toEqual(false)
    // normally we would call componentDidMount, however, that function requires
    // setTimeout, the combination of testing jest with both a timeout and a promise returned
    // from that is not well defined so we test it this way
    await instance.gatherData()
    expect(getNextPageOfData).toHaveBeenCalled()
    expect(wrapper.state('hasLoadedBufferData')).toEqual(true)
    expect(wrapper.state('hasMoreData')).toEqual(true)
  })

  it('handleViewMore works', async () => {
    const { wrapper, instance } = await createMountedComponent(props)
    expect(wrapper.state('hasLoadedBufferData')).toEqual(false)
    // normally we would call componentDidMount, however, that function requires
    // setTimeout, the combination of testing jest with both a timeout and a promise returned
    // from that is not well defined so we test it this way
    await instance.gatherData()

    // go through calling handle view more
    await instance.handleViewMore()
    expect(getLastQueryRequest).toHaveBeenCalled()
    expect(getNextPageOfData).toHaveBeenCalled()
    expect(wrapper.state('cardLimit')).toEqual(50)
  })
})