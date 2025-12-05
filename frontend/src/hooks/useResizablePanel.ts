import { useState, useCallback } from "react";

export function useResizablePanel(defaultWidth = 240, min = 150, max = 400) {
    const [width, setWidth] = useState(defaultWidth);

    const startResize = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;

        function onMouseMove(ev: MouseEvent) {
            const newWidth = width + (ev.clientX - startX);
            if (newWidth >= min && newWidth <= max) {
                setWidth(newWidth);
            }
        }

        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, [width, min, max]);

    return { width, startResize };
}
