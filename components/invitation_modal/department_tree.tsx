
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, { useState, useEffect } from 'react';

import './department_tree.scss';

interface Department {
    id: string;
    name: string;
    shortName?: string;
    children?: Department[];
}

interface DepartmentTreeProps {
    departments?: Department[];
}

const renderNode = (dept: Department, expanded: boolean) => {
    let i;
    if (dept.children && dept.children.length) {
        i = expanded ? <div className='h' /> : <><div className='h' /><div className='v' /></>;
    }
    return (
        <div key={dept.id} title={dept.name} className='dept-node-wrap'>
            <div>
                {i &&
                    <div className='dept-expand-btn'>
                        <div className='dept-expand-btn-box'>{i}</div>
                    </div>
                }
            </div>
            <div>
                <div className='dept-node-title'><div>{dept.shortName || dept.name}</div></div>
                {expanded &&
                    dept.children &&
                    dept.children.map((d) => (
                        renderNode(d, true)
                    ))}
            </div>
        </div>
    );
};

const DepartmentTree: React.FunctionComponent<DepartmentTreeProps> = (props) => {
    // eslint-disable-next-line react/prop-types
    const { departments } = props;

    const [depts, setdepts] = useState([] as Department[]);

    useEffect(() => {
        if (departments) {
            setdepts(departments);
        }
    }, [departments]);

    return (
        <div>
            {depts.map((d) => (
                renderNode(d, true)
            ))}
        </div>
    );
};

const depts: Department[] = [{ id: '1', name: 'dept1' }, { id: '2', name: 'dept2' }, { id: '3', name: 'dept3', children: [{ id: '11', name: 'dept11' }, { id: '12', name: 'dept12', children: [{ id: '111', name: 'dept111' }, { id: '112', name: 'dept112' }] }] }];
const tree = [{ id: '0', name: '所有部门', children: depts }];
export default () => <DepartmentTree departments={tree} />;

