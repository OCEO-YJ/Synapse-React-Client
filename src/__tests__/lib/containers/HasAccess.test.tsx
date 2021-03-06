import {
  faDatabase,
  faLink,
  faUnlockAlt,
  faLock,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { shallow } from 'enzyme'
import {
  FileHandle,
  RestrictableObjectType,
  RestrictionInformationRequest,
} from 'lib/utils/synapseTypes/'
import * as React from 'react'
import HasAccess, {
  FileHandleDownloadTypeEnum,
  ExternalFileHandleConcreteTypeEnum,
  GIGABYTE_SIZE,
  GoogleCloudFileHandleEnum,
  HasAccessProps,
} from '../../../lib/containers/HasAccess'
import {
  mockOpenRestrictionInformation,
  mockUnmetControlledDataRestrictionInformationACT,
  mockUnmetControlledDataRestrictionInformationRestricted,
} from '../../../mocks/mock_has_access_data'
import {
  mockFileHandle
} from '../../../mocks/mock_file_handle'
import {
  mockFolderEntity
} from '../../../mocks/mock_folder_entity'
import {
  mockFileEntity
} from '../../../mocks/mock_file_entity'


const SynapseClient = require('../../../lib/utils/SynapseClient')
const token: string = '123444'
const entityId = 'syn9988882982'
const isInDownloadList:boolean = true
const externalFileHandle: FileHandle = {
  id: '',
  etag: '',
  createdBy: '',
  createdOn: '',
  concreteType: ExternalFileHandleConcreteTypeEnum.ExternalFileHandle,
  contentType: '',
  contentMd5: '',
  fileName: '',
  storageLocationId: 0,
  contentSize: 0,
}
const tooLargeFileHandle: FileHandle = {
  id: '',
  etag: '',
  createdBy: '',
  createdOn: '',
  concreteType: '',
  contentType: '',
  contentMd5: '',
  fileName: '',
  storageLocationId: 0,
  contentSize: GIGABYTE_SIZE,
}

const createShallowComponent = async (
  props: HasAccessProps,
  disableLifecycleMethods: boolean = false,
) => {
  const wrapper = await shallow<HasAccess>(<HasAccess {...props} />, {
    disableLifecycleMethods,
  })

  const instance = wrapper.instance()
  return { wrapper, instance }
}
const props: HasAccessProps = {
  token,
  entityId,
  isInDownloadList
}

describe('basic tests', () => {
  it('works with open data no restrictions', async () => {
    SynapseClient.getEntity = jest.fn(() => 
      Promise.resolve(mockFileEntity),
    )
    SynapseClient.getFileEntityFileHandle = jest.fn(() => 
      Promise.resolve(mockFileHandle),
    )

    SynapseClient.getRestrictionInformation = jest.fn(() =>
      Promise.resolve(mockOpenRestrictionInformation),
    )
    const { wrapper, instance } = await createShallowComponent(props)
    const request: RestrictionInformationRequest = {
      restrictableObjectType: RestrictableObjectType.ENTITY,
      objectId: entityId,
    }
    expect(SynapseClient.getRestrictionInformation).toHaveBeenCalledWith(
      request,
      token,
    )
    expect(instance.state.restrictionInformation).toEqual(
      mockOpenRestrictionInformation,
    )
    const icons = wrapper.find(FontAwesomeIcon)
    expect(icons).toHaveLength(2)
    expect(icons.get(1).props.icon).toEqual(faUnlockAlt)
    // no access restrictions
    expect(wrapper.find('a')).toHaveLength(0)
  })

  it('works with a public folder', async () => {
    SynapseClient.getEntity = jest.fn(() => 
      Promise.resolve(mockFolderEntity),
    )
    SynapseClient.getFileEntityFileHandle = jest.fn(() => 
      Promise.reject('it is a folder'),
    )

    SynapseClient.getRestrictionInformation = jest.fn(() =>
      Promise.resolve(mockOpenRestrictionInformation),
    )
    const { wrapper } = await createShallowComponent(props)
    const icons = wrapper.find(FontAwesomeIcon)
    expect(icons).toHaveLength(2)
    expect(icons.get(1).props.icon).toEqual(faUnlockAlt)
    // no access restrictions
    expect(wrapper.find('a')).toHaveLength(0)
  })

  it('works when an ExternalFileHandle is passed in - not in download list', async () => {
    const { wrapper } = await createShallowComponent({
      ...props,
      isInDownloadList: false,
      fileHandle: externalFileHandle,
    })
    const icons = wrapper.find(FontAwesomeIcon)
    expect(icons).toHaveLength(2)
    expect(icons.get(1).props.icon).toEqual(faUnlockAlt)
    // no access restrictions
    expect(wrapper.find('a')).toHaveLength(0)
  })

  it('works when an ExternalFileHandle is passed in - in Download List', async () => {
    const { wrapper } = await createShallowComponent({
      ...props,
      fileHandle: externalFileHandle,
    })
    const icons = wrapper.find(FontAwesomeIcon)
    expect(icons).toHaveLength(2)
    expect(icons.get(1).props.icon).toEqual(faLink)
    const tooltipSpan = wrapper.find(
      `[data-tip="${
        HasAccess.tooltipText[FileHandleDownloadTypeEnum.ExternalFileLink]
      }"]`,
    )
    expect(tooltipSpan).toHaveLength(1)
    // no access restrictions
    expect(wrapper.find('a')).toHaveLength(0)
  })

  it('works when a cloud file handle is passed in - in Download List', async () => {
    const cloudFileHandle: FileHandle = {
      id: '',
      etag: '',
      createdBy: '',
      createdOn: '',
      concreteType: GoogleCloudFileHandleEnum.GoogleCloudFileHandle,
      contentType: '',
      contentMd5: '',
      fileName: '',
      storageLocationId: 0,
      contentSize: 0,
    }
    SynapseClient.getEntity = jest.fn(() => 
      Promise.resolve(mockFileEntity),
    )
    SynapseClient.getFileEntityFileHandle = jest.fn(() => 
      Promise.resolve(cloudFileHandle),
    )

    const { wrapper } = await createShallowComponent({
      ...props,
      fileHandle: cloudFileHandle,
    })
    const icons = wrapper.find(FontAwesomeIcon)
    expect(icons).toHaveLength(2)
    expect(icons.get(1).props.icon).toEqual(faLink)
    const tooltipSpan = wrapper.find(
      `[data-tip="${HasAccess.tooltipText[FileHandleDownloadTypeEnum.ExternalCloudFile]}"]`,
    )
    expect(tooltipSpan).toHaveLength(1)
    // no access restrictions
    expect(wrapper.find('a')).toHaveLength(0)
  })

  it('works when the file is too large in Download List', async () => {
    const { wrapper } = await createShallowComponent({
      ...props,
      fileHandle: tooLargeFileHandle,
    })
    const icons = wrapper.find(FontAwesomeIcon)
    expect(icons).toHaveLength(2)
    expect(icons.get(1).props.icon).toEqual(faDatabase)
    const tooltipSpan = wrapper.find(
      `[data-tip="${HasAccess.tooltipText[FileHandleDownloadTypeEnum.TooLarge]}"]`,
    )
    expect(tooltipSpan).toHaveLength(1)
    // no access restrictions
    expect(wrapper.find('a')).toHaveLength(0)
  })

  it('works when the file is too large for Download List, but HasAccess is not in the Download List', async () => {
    const { wrapper } = await createShallowComponent({
      ...props,
      isInDownloadList: false,
      fileHandle: tooLargeFileHandle,
    })
    const icons = wrapper.find(FontAwesomeIcon)
    expect(icons).toHaveLength(2)
    expect(icons.get(1).props.icon).toEqual(faUnlockAlt)
    // no access restrictions
    expect(wrapper.find('a')).toHaveLength(0)
  })

  it('works when download is IsOpenNoRestrictions', async () => {
    const IsOpenNoUnmetAccessRestrictions: FileHandle = {
      id: '',
      etag: '',
      createdBy: '',
      createdOn: '',
      concreteType: '',
      contentType: '',
      contentMd5: '',
      fileName: '',
      storageLocationId: 0,
      contentSize: 0,
    }
    const { wrapper } = await createShallowComponent({
      ...props,
      fileHandle: IsOpenNoUnmetAccessRestrictions,
    })
    const icons = wrapper.find(FontAwesomeIcon)
    expect(icons).toHaveLength(2)
    expect(icons.get(1).props.icon).toEqual(faUnlockAlt)
    // no access restrictions
    expect(wrapper.find('a')).toHaveLength(0)
  })

  it('works with unmet controlled access data - controlled by act', async () => {
    SynapseClient.getEntity = jest.fn(() => 
      Promise.resolve(mockFileEntity),
    )
    SynapseClient.getFileEntityFileHandle = jest.fn(() => 
      Promise.reject('unmet restriction'),
    )

    SynapseClient.getRestrictionInformation = jest.fn(() =>
      Promise.resolve(mockUnmetControlledDataRestrictionInformationACT),
    )

    const { wrapper } = await createShallowComponent(props)
    const request: RestrictionInformationRequest = {
      restrictableObjectType: RestrictableObjectType.ENTITY,
      objectId: entityId,
    }
    expect(SynapseClient.getRestrictionInformation).toHaveBeenCalledWith(
      request,
      token,
    )
    expect(wrapper.instance().state.restrictionInformation).toEqual(
      mockUnmetControlledDataRestrictionInformationACT,
    )
    // const link = wrapper.find('a')
    // expect(link).toHaveLength(1)
    // const icons = wrapper.find(FontAwesomeIcon)
    // expect(icons).toHaveLength(2)
    // expect(icons.get(1).props.icon).toEqual(faLock)
    // const tooltipSpan = wrapper.find(
    //   `[data-tip="${
    //     HasAccess.tooltipText[FileHandleDownloadTypeEnum.AccessBlocked]
    //   }"]`,
    // )
    // expect(tooltipSpan).toHaveLength(1)
    // // no access restrictions
    // expect(wrapper.find('a').text()).toEqual('Request Access')
  })

  it('works with unmet controlled access data - terms of use', async () => {
    SynapseClient.getEntity = jest.fn(() => 
      Promise.resolve(mockFileEntity),
    )
    SynapseClient.getFileEntityFileHandle = jest.fn(() => 
      Promise.reject('unmet terms of use'),
    )
    SynapseClient.getRestrictionInformation = jest.fn(() =>
      Promise.resolve(mockUnmetControlledDataRestrictionInformationRestricted),
    )
    const { wrapper } = await createShallowComponent(props)
    const request: RestrictionInformationRequest = {
      restrictableObjectType: RestrictableObjectType.ENTITY,
      objectId: entityId,
    }
    expect(SynapseClient.getRestrictionInformation).toHaveBeenCalledWith(
      request,
      token,
    )
    expect(wrapper.instance().state.restrictionInformation).toEqual(
      mockUnmetControlledDataRestrictionInformationRestricted,
    )
    // const link = wrapper.find('a')
    // expect(link).toHaveLength(1)
    // const icons = wrapper.find(FontAwesomeIcon)
    // expect(icons).toHaveLength(2)
    // expect(icons.get(1).props.icon).toEqual(faLock)
    // const tooltipSpan = wrapper.find(
    //   `[data-tip="${
    //     HasAccess.tooltipText[FileHandleDownloadTypeEnum.AccessBlocked]
    //   }"]`,
    // )
    // expect(tooltipSpan).toHaveLength(1)
    // // no access restrictions
    // expect(wrapper.find('a').text()).toEqual('Request Access')
  })
})
