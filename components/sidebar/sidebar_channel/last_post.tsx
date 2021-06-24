import React, { useEffect, useCallback } from 'react';

interface LastPostProps {
    isCurrentChannel?: boolean;
    channelId: string,
}

const LastPost: React.FunctionComponent<LastPostProps> = ({ isCurrentChannel, channelId }) => {

    const getLastPost = useCallback(
        (channelId: string) => {
            console.log('Get last post by channelId:', channelId)
        },
        [],
    )
    useEffect(() => {
        let intv: NodeJS.Timeout | undefined;
        (() => {
            if (intv) clearInterval(intv);
            intv = setInterval(() => { getLastPost(channelId); }, 1000);
        })()
        return () => {
            if (intv) clearInterval(intv);
        }
    }, [channelId])
    return <div className="SidebarLink" style={{ height: 32, lineHeight: '32px', width: '100%', zIndex: 0, paddingLeft: 32, backgroundColor: isCurrentChannel ? 'rgba(255,255,255,0.08)' : 'transparent' }}>
        <div title="最后一条消息的内容最后一条消息的内容最后一条消息的内容最后一条消息的内容最后一条消息的内容" style={{ overflow: 'hidden', fontSize: 12, whiteSpace: 'nowrap', textOverflow: 'ellipsis', }}><i className="icon fa fa-angle-right"></i>&nbsp;最后一条消息的内容最后一条消息的内容最后一条消息的内容最后一条消息的内容最后一条消息的内容</div>
    </div>;
};

export default LastPost;
