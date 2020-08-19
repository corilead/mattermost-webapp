// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
/* eslint-disable react/no-string-refs */

import React, { ReactNode } from 'react';
import { getFileThumbnailUrl, getFileUrl } from 'mattermost-redux/utils/file_utils';
import { FileInfo } from 'mattermost-redux/types/files';

import FilenameOverlay from 'components/file_attachment/filename_overlay';
import Constants, { FileTypes } from 'utils/constants';
import * as Utils from 'utils/utils.jsx';

import FileProgressPreview from '../file_preview/file_progress_preview';

type UploadInfo = {
    name: string;
    percent?: number;
    type?: string;
}
export type FilePreviewInfo = FileInfo & UploadInfo;

type Props = {
    enableSVGs: boolean;
    onRemove: (id: string) => void;
    onChangeSecretLevel: (id: string, value: string) => void;
    fileInfos: FilePreviewInfo[];
    uploadsInProgress?: string[];
    uploadsProgressPercent?: { [clientID: string]: FilePreviewInfo };
}

export default class FilePreview extends React.PureComponent<Props> {
    static defaultProps = {
        fileInfos: [],
        uploadsInProgress: [],
        uploadsProgressPercent: {},
    };

    handleRemove = (id: string) => {
        this.props.onRemove(id);
    }

    handleChangeSecretLevel = (id: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.onChangeSecretLevel(id, e.target.value);
    }

    render() {
        const previews: ReactNode[] = [];

        this.props.fileInfos.forEach((info) => {
            const type = Utils.getFileType(info.extension);

            let className = 'file-preview post-image__column';
            let previewImage;
            if (type === FileTypes.SVG && this.props.enableSVGs) {
                previewImage = (
                    <img
                        alt={'file preview'}
                        className='post-image normal'
                        src={getFileUrl(info.id)}
                    />
                );
            } else if (type === FileTypes.IMAGE) {
                let imageClassName = 'post-image';

                if ((info.width && info.width < Constants.THUMBNAIL_WIDTH) && (info.height && info.height < Constants.THUMBNAIL_HEIGHT)) {
                    imageClassName += ' small';
                } else {
                    imageClassName += ' normal';
                }

                let thumbnailUrl = getFileThumbnailUrl(info.id);
                if (Utils.isGIFImage(info.extension) && !info.has_preview_image) {
                    thumbnailUrl = getFileUrl(info.id);
                }

                previewImage = (
                    <div
                        className={imageClassName}
                        style={{
                            backgroundImage: `url(${thumbnailUrl})`,
                            backgroundSize: 'cover',
                        }}
                    />
                );
            } else {
                className += ' custom-file';
                previewImage = <div className={'file-icon ' + Utils.getIconClassName(type)} />;
            }

            previews.push(
                <div
                    key={info.id}
                    className={className}
                >
                    <div className='post-image__thumbnail'>
                        {previewImage}
                    </div>
                    <div className='post-image__details'>
                        <div className='post-image__detail_wrapper'>
                            <div className='post-image__detail'>
                                <FilenameOverlay
                                    fileInfo={info}
                                    compactDisplay={false}
                                    canDownload={false}
                                />
                                {info.extension && <span className='post-image__type'>{info.extension.toUpperCase()}</span>}
                                <span className='post-image__size'>{Utils.fileSizeToString(info.size)}</span>
                            </div>
                            <div>
                                <select
                                    className='form-control'
                                    style={{ width: 100, marginRight: 8 }}
                                    onChange={(e) => {
                                        this.handleChangeSecretLevel(info.id, e);
                                    }}
                                >
                                    <option value={undefined}>未指定</option>
                                    <option value='非密'>非密</option>
                                    <option value='内部'>内部</option>
                                    <option value='秘密'>秘密</option>
                                    <option value='机密'>机密</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <a
                                className='file-preview__remove'
                                onClick={this.handleRemove.bind(this, info.id)}
                            >
                                <i className='icon icon-close' />
                            </a>
                        </div>
                    </div>
                </div>,
            );
        });

        if (this.props.uploadsInProgress && this.props.uploadsProgressPercent) {
            const uploadsProgressPercent = this.props.uploadsProgressPercent;
            this.props.uploadsInProgress.forEach((clientId) => {
                const fileInfo = uploadsProgressPercent[clientId];
                if (fileInfo) {
                    previews.push(
                        <FileProgressPreview
                            key={clientId}
                            clientId={clientId}
                            fileInfo={fileInfo}
                            handleRemove={this.handleRemove}
                        />,
                    );
                }
            });
        }

        return <>{previews}</>;
    }
}
/* eslint-enable react/no-string-refs */
