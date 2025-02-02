import React from "react";
import { Chrono } from "react-chrono";
import { useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";

const Timeline2 = ({ timeline, moveCharacterToTimeline, assignments }) => {
    const navigate = useNavigate();

    const chronoItems = timeline.map((event) => ({
        title: `Pg ${event.page}`,
        cardTitle: event.title || `Event ${event.page}`,
        cardDetailedText: event.description,
        cardSubtitle: assignments[event.page]
            ?.map((char) => char.name)
            .join(", "),
    }));

    const DroppableTimelineWrapper = ({ children }) => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: "CHARACTER",
            drop: (item, monitor) => {
                const clientOffset = monitor.getClientOffset();
                const eventIndex = Math.floor(
                    (clientOffset.y / window.innerHeight) * timeline.length
                );
                const event = timeline[eventIndex];

                if (event) {
                    moveCharacterToTimeline(item.character, event.page);
                    navigate(
                        `/character-perspective/${item.character}/${event.page}`
                    );
                }
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
            }),
        }));

        return (
            <div
                ref={drop}
                className={`w-full h-full ${isOver ? "bg-gray-50" : ""}`}
            >
                {children}
            </div>
        );
    };

    const handleCardClick = (index) => {
        const event = timeline[index];
        if (assignments[event.page]?.length > 0) {
            const character = assignments[event.page][0];
            navigate(`/character-perspective/${character.name}/${event.page}`);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-visible">
            <div className="flex-1 overflow-visible">
                <div
                    className="h-full overflow-y-auto overflow-visible"
                    style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                    <DroppableTimelineWrapper>
                        <Chrono
                            items={chronoItems}
                            mode="VERTICAL"
                            cardHeight={150}
                            hideControls={true}
                            theme={{
                                primary: "#2564EC",
                                cardBgColor: "white",
                                cardForeColor: "white",
                                titleColor: "#2564EC",
                                secondary: "white",
                            }}
                            enableBreakPoint
                            showAllCardsHorizontal={false}
                            flipLayout={false}
                            useReadMore={false}
                            onCardClick={(index) => handleCardClick(index)}
                        >
                            {chronoItems.map((item, index) => (
                                <div key={index} className="p-4">
                                    {assignments[timeline[index].page]?.map(
                                        (char) => (
                                            <span
                                                key={char.name}
                                                className="px-2 py-1 bg-blue-700 text-white rounded-full text-sm mr-2"
                                            >
                                                {char.name}
                                            </span>
                                        )
                                    )}
                                </div>
                            ))}
                        </Chrono>
                    </DroppableTimelineWrapper>
                </div>
            </div>
        </div>
    );
};

export default Timeline2;
