
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, { useState, useEffect, useCallback } from 'react';

import './department_tree.scss';

interface Department {
    id: string;
    name: string;
    shortName?: string;
    children?: Department[];
}

interface DepartmentTreeProps {
    departments?: Department[];
    selected?: string[];
    multiSelect?: boolean;
    onSelect?: (keys: string[]) => void;
}

const collectKeys = (data: Department[], result: string[]) => {
    for (const d of data) {
        if (d.children && d.children.length) {
            result.push(d.id);
            collectKeys(d.children, result);
        }
    }
};

const DepartmentTree: React.FunctionComponent<DepartmentTreeProps> = (props) => {
    // eslint-disable-next-line react/prop-types
    const { departments, selected, onSelect, multiSelect } = props;
    const [depts, setdepts] = useState([] as Department[]);
    const [expandedKeys, setexpandedKeys] = useState([] as string[]);
    const [selectedKeys, setselectedKeys] = useState([] as string[]);

    const setExpanded = useCallback(
        (dept) => {
            const index = expandedKeys.indexOf(dept.id);
            if (index < 0) {
                setexpandedKeys([...expandedKeys, dept.id]);
            } else {
                const result = [...expandedKeys];
                result.splice(index, 1);
                setexpandedKeys(result);
            }
        },
        [expandedKeys],
    );

    const handleSelect = useCallback(
        (dept: Department) => {
            let keys;
            if (multiSelect) {
                keys = [...selectedKeys];
                if (selectedKeys.includes(dept.id)) {
                    keys.splice(selectedKeys.indexOf(dept.id), 1);
                } else {
                    keys.push(dept.id);
                }
            } else {
                keys = [dept.id];
            }
            setselectedKeys(keys);
            if (onSelect) {
                onSelect(keys);
            }
        },
        [selectedKeys, multiSelect],
    );

    const renderNode = (dept: Department, _expandedKeys: string[], _selectedKeys: string[]) => {
        let i;
        const expanded = _expandedKeys.includes(dept.id);
        const s = _selectedKeys.includes(dept.id);
        if (dept.children && dept.children.length) {
            i = expanded ? <div className='h' /> : <><div className='h' /><div className='v' /></>;
        }
        return (
            <div key={dept.id} title={dept.name} className='dept-node-wrap'>
                <div>
                    {i &&
                        <div className='dept-expand-btn'>
                            <div
                                className='dept-expand-btn-box'
                                onClick={() => {
                                    setExpanded(dept);
                                }}
                            >{i}</div>
                        </div>
                    }
                </div>
                <div>
                    <div
                        className={`dept-node-title ${s ? 'selected' : ''}`}
                        onClick={() => {
                            handleSelect(dept);
                        }}
                    ><div>{dept.shortName || dept.name}</div></div>
                    {expanded &&
                        dept.children &&
                        dept.children.map((d) => (
                            renderNode(d, _expandedKeys, _selectedKeys)
                        ))}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (departments) {
            setdepts(departments);
            const keys: string[] = [];
            collectKeys(departments, keys);
            setexpandedKeys(keys);
        }
    }, [departments]);

    useEffect(() => {
        if (multiSelect) {
            setselectedKeys(selected || []);
        } else if (selected?.length) {
            setselectedKeys([selected[0]]);
        } else {
            setselectedKeys([]);
        }
    }, [selected, multiSelect]);

    return (
        <div>
            {depts.map((d) => renderNode(d, expandedKeys, selectedKeys))}
        </div>
    );
};

const depts: Department[] = [{ id: '1', name: 'dept1' }, { id: '2', name: 'dept2' }, { id: '3', name: 'dept3', children: [{ id: '11', name: 'dept11' }, { id: '12', name: 'dept12', children: [{ id: '111', name: 'dept111' }, { id: '112', name: 'dept112' }] }] }];
const tree = [{ id: '0', name: '所有部门', children: depts }];
export default () => <DepartmentTree departments={tree} />;

