import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSpring, animated } from "@react-spring/web";
import "./HomePage.css";

type GroupStyle = {
  top: string;
  left: string;
  flexDirection: "row" | "column";
  zIndex: number;
};

type ImageGroup = {
  id: string;
  images: string[];
  style: GroupStyle;
  mergedImages?: { original: string[]; merged: string }[];
};

interface DraggableCardProps {
  src: string;
  groupId?: string;
  isMerging?: boolean;
  isMerged?: boolean;
  isHovered?: boolean;
  canMerge?: boolean; // This is correct - boolean | undefined
}

interface DroppableGroupProps {
  group: ImageGroup;
  onDrop: (src: string, groupId: string, sourceGroupId?: string) => void;
  onMerge: (groupId: string, src1: string, src2: string) => void;
  children: React.ReactNode;
}

const ItemTypes = {
  CARD: "card",
};

const MERGE_PAIRS: Record<string, Record<string, string>> = {
  "/happy-dolphan.svg": {
    "/angry-dolphan.svg": "/same.svg",
  },
  "/angry-dolphan.svg": {
    "/happy-dolphan.svg": "/same.svg",
  },
  "/angry-turtle.svg": {
    "/happy-turtle.svg": "/same.svg",
  },
  "/happy-turtle.svg": {
    "/angry-turtle.svg": "/same.svg",
  },
  "/white-ball.svg": {
    "/black-ball.svg": "/same.svg",
  },
  "/black-ball.svg": {
    "/white-ball.svg": "/same.svg",
  },
  "/same.svg": {
    "/closebox.svg": "/openbox.svg", // New special interaction
  },
};

const generateNonOverlappingStyles = (count: number): GroupStyle[] => {
  const styles: GroupStyle[] = [];
  const groupWidth = 150;
  const groupHeight = 150;
  const boardWidth = window.innerWidth - 140;
  const boardHeight = window.innerHeight - 250;
  const maxAttempts = 100;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let newStyle: GroupStyle;
    let hasOverlap = false;

    do {
      hasOverlap = false;
      newStyle = {
        top: `${
          (Math.floor(Math.random() * (boardHeight - groupHeight)) /
            boardHeight) *
          100
        }%`,
        left: `${
          (Math.floor(Math.random() * (boardWidth - groupWidth)) / boardWidth) *
          100
        }%`,
        flexDirection: Math.random() < 0.5 ? "row" : "column",
        zIndex: i + 1,
      };

      const newTop = (parseFloat(newStyle.top) / 100) * boardHeight;
      const newLeft = (parseFloat(newStyle.left) / 100) * boardWidth;

      for (const style of styles) {
        const existingTop = (parseFloat(style.top) / 100) * boardHeight;
        const existingLeft = (parseFloat(style.left) / 100) * boardWidth;

        if (
          Math.abs(newLeft - existingLeft) < groupWidth &&
          Math.abs(newTop - existingTop) < groupHeight
        ) {
          hasOverlap = true;
          break;
        }
      }

      attempts++;
    } while (hasOverlap && attempts < maxAttempts);

    styles.push(newStyle);
  }

  return styles;
};

const allImages = [
  "/happy-dolphan.svg",
  "/angry-dolphan.svg",
  "/angry-turtle.svg",
  "/happy-turtle.svg",
  "/white-ball.svg",
  "/black-ball.svg",
  "/closebox.svg",
];

const DraggableCard: React.FC<DraggableCardProps> = ({
  src,
  groupId,
  isMerging = false,
  isMerged = false,
  isHovered = false,
  canMerge = false,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { src, groupId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isMerged,
  }));

  const animationProps = useSpring({
    opacity: isMerging ? 0 : 1,
    transform: isMerging ? "scale(1.5)" : "scale(1)",
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.img
      ref={drag as any}
      src={src}
      alt=""
      style={{
        ...animationProps,
        opacity: isDragging ? 0.5 : animationProps.opacity,
        cursor: isMerged ? "default" : "move",
        width: "50px",
        height: "50px",
        filter: isMerged
          ? "drop-shadow(0 0 8px rgba(0,255,0,0.9))"
          : canMerge
          ? "drop-shadow(0 0 10px rgba(255,215,0,0.9))"
          : isHovered
          ? "drop-shadow(0 0 10px rgba(0,0,255,0.9))"
          : "none",
        border: canMerge
          ? "2px solid gold"
          : isHovered
          ? "2px solid blue"
          : "none",
        borderRadius: "15px",
        transition: "all 0.3s ease",
        zIndex: isMerging ? 10 : 1,
      }}
      className={isMerged ? "solving-equation-merged-image" : ""}
    />
  );
};

const DroppableGroup: React.FC<DroppableGroupProps> = ({
  group,
  onDrop,
  onMerge,
  children,
}) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [dragItem, setDragItem] = useState<{
    src: string;
    groupId?: string;
  } | null>(null);

  const canMergeWith = (src1: string, src2: string) => {
    return MERGE_PAIRS[src1]?.[src2] || MERGE_PAIRS[src2]?.[src1];
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: { src: string; groupId?: string }) => {
      setHoveredImage(null);
      setDragItem(null);

      // Check for merge possibilities with all images in the group
      for (const groupImage of group.images) {
        if (canMergeWith(item.src, groupImage)) {
          onMerge(group.id, item.src, groupImage);
          return;
        }
      }

      // If no merge possible, just add to group
      onDrop(item.src, group.id, item.groupId);
    },
    hover: (item: { src: string; groupId?: string }, monitor) => {
      if (monitor.canDrop() && monitor.isOver({ shallow: true })) {
        setDragItem(item);
        const clientOffset = monitor.getClientOffset();
        if (clientOffset) {
          const elements = document.elementsFromPoint(
            clientOffset.x,
            clientOffset.y
          );
          const hoveredImg = elements.find(
            (el) =>
              el.tagName === "IMG" &&
              group.images.includes(el.getAttribute("src") || "")
          );
          setHoveredImage(hoveredImg?.getAttribute("src") || null);
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop as any}
      className="solving-equation-image-group"
      style={{
        ...group.style,
        zIndex: group.style.zIndex,
        backgroundColor: isOver ? "rgba(0, 0, 255, 0.1)" : "transparent",
        border: isOver ? "2px dashed rgba(0, 0, 255, 0.5)" : "none",
      }}
    >
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement<DraggableCardProps>(child) &&
          child.props.src
        ) {
          const canMerge = dragItem
            ? !!canMergeWith(dragItem.src, child.props.src)
            : false;

          return React.cloneElement(child, {
            isHovered: hoveredImage === child.props.src,
            canMerge,
          });
        }
        return child;
      })}
    </div>
  );
};

const Homepage: React.FC = () => {
  const [groups, setGroups] = useState<ImageGroup[]>([]);
  const [bottomCards, setBottomCards] = useState<string[]>(allImages);

  useEffect(() => {
    const shuffledImages = [...allImages].sort(() => Math.random() - 0.5);
    const groupCount = Math.min(3, Math.ceil(shuffledImages.length / 2));
    const groupStyles = generateNonOverlappingStyles(groupCount);

    const newGroups: ImageGroup[] = [];
    for (let i = 0; i < groupCount; i++) {
      const images = [];
      if (i * 2 < shuffledImages.length) images.push(shuffledImages[i * 2]);
      if (i * 2 + 1 < shuffledImages.length)
        images.push(shuffledImages[i * 2 + 1]);

      newGroups.push({
        id: `group-${i}`,
        images,
        style: groupStyles[i],
      });
    }

    setGroups(newGroups);
  }, []);

  const handleDrop = (
    src: string,
    targetGroupId: string,
    sourceGroupId?: string
  ) => {
    setGroups((prevGroups) => {
      const targetGroup = prevGroups.find((g) => g.id === targetGroupId);
      if (!targetGroup || targetGroup.images.length >= 3) {
        return prevGroups;
      }

      let updatedGroups = prevGroups;
      if (sourceGroupId && sourceGroupId !== targetGroupId) {
        updatedGroups = prevGroups.map((group) =>
          group.id === sourceGroupId
            ? { ...group, images: group.images.filter((img) => img !== src) }
            : group
        );
      }

      return updatedGroups.map((group) =>
        group.id === targetGroupId
          ? { ...group, images: [...group.images, src] }
          : group
      );
    });

    if (!sourceGroupId) {
      setBottomCards((prev) => prev.filter((card) => card !== src));
    }
  };

  const handleMerge = (groupId: string, src1: string, src2: string) => {
    const mergedImage = MERGE_PAIRS[src1]?.[src2] || MERGE_PAIRS[src2]?.[src1];
    if (!mergedImage) return;

    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id !== groupId) return group;

        return {
          ...group,
          images: [
            ...group.images.filter((img) => img !== src1 && img !== src2),
            mergedImage,
          ],
          mergedImages: [
            ...(group.mergedImages || []),
            { original: [src1, src2], merged: mergedImage },
          ],
        };
      })
    );

    // If one of the sources was from bottom cards, remove it
    setBottomCards((prev) =>
      prev.filter((card) => card !== src1 && card !== src2)
    );
  };

  const renderGroupImages = (group: ImageGroup) => {
    return group.images.map((imgSrc) => (
      <DraggableCard
        key={`${group.id}-${imgSrc}`}
        src={imgSrc}
        groupId={group.id}
        isMerged={group.mergedImages?.some((m) => m.merged === imgSrc)}
      />
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="solving-equation-wrapper">
        <div className="solving-equation-cover">
          <img src="/background.svg" alt="" />
        </div>

        <div className="solving-equation-board">
          <img src="/board.svg" alt="" />

          <div className="solving-equation-board-calculations">
            {groups.map((group) => (
              <DroppableGroup
                key={group.id}
                group={group}
                onDrop={handleDrop}
                onMerge={handleMerge}
              >
                {renderGroupImages(group)}
              </DroppableGroup>
            ))}
          </div>
        </div>

        <div className="solving-equation-bottom-cards">
          {bottomCards.map((imgSrc) => (
            <DraggableCard key={`bottom-${imgSrc}`} src={imgSrc} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Homepage;
