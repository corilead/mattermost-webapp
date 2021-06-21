// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import { Overlay } from 'react-bootstrap';

import { popOverOverlayPosition } from 'utils/position_utils';
import { Constants } from 'utils/constants';
import './preset_picker.scss';

const wordList = ["常用回复1", "常用回复2", "常用回复3", "常用回复4", "常用回复5", "常用回复6", "常用回复7", "常用回复8", "常用回复9"];

const Picker = ({ rightOffset, topOffset, style, placement, select }) => {
    let pickerStyle;
    if (style && !(style.left === 0 && style.top === 0)) {
        if (placement === 'top' || placement === 'bottom') {
            pickerStyle = {
                top: style.top,
                bottom: style.bottom,
                right: rightOffset,
            };
        } else {
            pickerStyle = { ...style };
        }

        if (pickerStyle.top) {
            pickerStyle.top += topOffset;
        }
    }
    let pickerClass = 'emoji-picker';
    if (placement === 'bottom') {
        pickerClass += ' bottom';
    }
    return <div id='presetPicker'
        style={pickerStyle} className={`a11y__popup ${pickerClass}`}>
        <ul className="preset_picker_list">
            {wordList.map(w => <li key={w} title={w}><a onClick={(e) => {e.persist(); select(e, w) }}>{w}</a></li>)}
        </ul>
    </div>
}


export default class PresetPickerOverlay extends React.PureComponent {
    static CENTER_SPACE_REQUIRED_ABOVE = 476;
    static CENTER_SPACE_REQUIRED_BELOW = 497;

    static RHS_SPACE_REQUIRED_ABOVE = 420;
    static RHS_SPACE_REQUIRED_BELOW = 420;

    static propTypes = {
        show: PropTypes.bool.isRequired,
        container: PropTypes.func,
        target: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired,
        onHide: PropTypes.func.isRequired,
        topOffset: PropTypes.number,
        rightOffset: PropTypes.number,
        spaceRequiredAbove: PropTypes.number,
        spaceRequiredBelow: PropTypes.number,
    };

    // Reasonable defaults calculated from from the center channel
    static defaultProps = {
        spaceRequiredAbove: PresetPickerOverlay.CENTER_SPACE_REQUIRED_ABOVE,
        spaceRequiredBelow: PresetPickerOverlay.CENTER_SPACE_REQUIRED_BELOW,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    static pickerPosition(props) {
        const trigger = props.target();

        if (typeof props.rightOffset !== 'undefined') {
            return props.rightOffset;
        }

        let rightOffset = Constants.DEFAULT_EMOJI_PICKER_RIGHT_OFFSET;
        if (trigger) {
            rightOffset = window.innerWidth - trigger.getBoundingClientRect().left - Constants.DEFAULT_EMOJI_PICKER_LEFT_OFFSET;

            if (rightOffset < Constants.DEFAULT_EMOJI_PICKER_RIGHT_OFFSET) {
                rightOffset = Constants.DEFAULT_EMOJI_PICKER_RIGHT_OFFSET;
            }
        }

        return rightOffset;
    }

    static getPlacement(props) {
        const target = props.target();
        if (target) {
            const targetBounds = target.getBoundingClientRect();
            return popOverOverlayPosition(targetBounds, window.innerHeight, props.spaceRequiredAbove, props.spaceRequiredBelow);
        }

        return 'top';
    }

    static getDerivedStateFromProps(props) {
        return {
            placement: PresetPickerOverlay.getPlacement(props),
            rightOffset: PresetPickerOverlay.pickerPosition(props),
        };
    }

    render() {
        return (
            <Overlay
                show={this.props.show}
                placement={this.state.placement}
                rootClose={true}
                container={this.props.container}
                onHide={this.props.onHide}
                target={this.props.target}
                animation={false}
            >
                <Picker rightOffset={this.state.rightOffset}
                    topOffset={this.props.topOffset} select={this.props.onSelect} />
            </Overlay>
        );
    }
}
