import * as React from 'react'
import { render, act } from '@testing-library/react'
import AccessApprovalCheckMark, {
  CheckMarkProps,
} from '../../../lib/containers/access_requirement_list/AccessApprovalCheckMark'
import AcceptedRequirements, {
  AcceptedRequirementsProps,
} from '../../../lib/containers/access_requirement_list/AcceptedRequirements'
import AccessRequirementList, {
  AccessRequirementListProps,
} from '../../../lib/containers/access_requirement_list/AccessRequirementList'
import {
  UserProfile,
  WikiPageKey,
  ObjectType,
  AccessRequirement,
  ACCESS_TYPE,
  AccessApproval,
  ApprovalState,
} from '../../../lib/utils/synapseTypes/'
import { mount, ReactWrapper } from 'enzyme'
import { wrap } from 'lodash-es'

describe('Accepted Requirements works as expect', () => {
  let container: HTMLElement
  let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>

  async function init(prop: AcceptedRequirementsProps) {
    await act(async () => {
      wrapper = await mount(<AcceptedRequirements {...prop} />)
      container = await render(<AcceptedRequirements {...prop} />).container
    })
  }

  const SynapseClient = require('../../../lib/utils/SynapseClient')

  const user: UserProfile = {
    firstName: 'Syanpase',
    lastName: 'SageBase',
    ownerId: '_',
    userName: 'Synapse.SageBase',
  }

  const wikiPage: WikiPageKey = {
    wikiPageId: '_',
    ownerObjectId: '_',
    ownerObjectType: ObjectType.ACCESS_REQUIREMENT,
  }

  const accessRequirement: AccessRequirement = {
    versionNumber: 1,
    id: 5,
    etag: '_',
    createdOn: '_',
    modifiedOn: '_',
    createdBy: '_',
    modifiedBy: '_',
    subjectIds: [],
    accessType: ACCESS_TYPE.CREATE,
    concreteType: '_',
  }

  const props = {
    user: user,
    token: '_',
    wikiPage: wikiPage,
    accessRequirement: accessRequirement,
    accessRequirementStatus: {
      accessRequirementId: '_',
      concreteType: '_',
      isApproved: true,
      expiredOn: '_',
    },
    onHide: jest.fn(),
  }

  it('Redners a AccessRequirements with valid props', async () => {
    await init(props)
    expect(container.innerHTML).not.toEqual('')
  })

  it('Render AccessRequirements correctly if user is already accepted requirements', async () => {
    await init(props)
    expect(wrapper.find(AccessApprovalCheckMark).prop('isCompleted')).toBe(true)
    expect(wrapper.find('.button-container.hide')).toHaveLength(1)
  })

  const accessApprovalMock: AccessApproval = {
    requirementId: 1,
    submitterId: '_',
    accessorId: '_',
    state: ApprovalState.APPROVED,
  }

  it('Render AccessRequirements correctly when user click accept button', async () => {
    await init(props)

    SynapseClient.postAccessApproval = jest
      .fn()
      .mockResolvedValue(accessApprovalMock)

    await act(async () => {
      await wrapper.find('button.accept-button').simulate('click')
    })

    expect(wrapper.find(AccessApprovalCheckMark).prop('isCompleted')).toBe(true)
    expect(wrapper.find('.button-container.hide')).toHaveLength(1)
  })
})

describe('Check Mark works as expect', () => {
  let container: HTMLElement

  function init(prop: CheckMarkProps) {
    container = render(<AccessApprovalCheckMark {...prop} />).container
  }

  it('Check Marks color turns into green if isCompleted is true ', () => {
    const props = {
      isCompleted: true,
    }
    init(props)
    expect(container.querySelectorAll('div')[0].className).toMatch(
      'check-mark-container green',
    )
  })

  it('Check Marks color turns into orange if isCompleted is false ', () => {
    const props = {
      isCompleted: false,
    }
    init(props)
    expect(container.querySelectorAll('div')[0].className).toMatch(
      'check-mark-container orange',
    )
  })
})