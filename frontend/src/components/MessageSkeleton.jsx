

function MessageSkeleton() {

    const skeletonMessages = Array(6).fill(null);

    return (
        <div className="flex-1 overflow-y-auto space-y-4">
            {skeletonMessages.map((_, idx) => (
                <div
                    key={idx}
                    className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
                >
                    <div className="chat-image avatar">
                        <div className="size-10 rounded-full">
                            <div className="skeleton w-full h-full rounded-full" />
                        </div>
                    </div>

                    <div className="chat-header mb-1">
                        <div className="skeleton w-16 h-4" />
                    </div>

                    <div className="chat-bubble bg-transparent p-0">
                        <div className="skeleton w-[200px] h-16" />
                    </div>
                    
                </div>
            ))}
        </div>
    )
}

export default MessageSkeleton