import rectangles from "./rectangles.json" assert { type: "json" };

function potpack(rectangles, containerWidth, containerHeight) {
  rectangles.sort((a, b) => b.h - a.h);

  const spaces = [{ x: 0, y: 0, w: containerWidth, h: containerHeight }];
  const placements = [];

  let width = 0;
  let height = 0;
  let totalArea = 0;
  let emptyArea = 0;

  for (let i = 0; i < rectangles.length; i++) {
    const rectangle = rectangles[i];
    let placed = false;

    for (let j = spaces.length - 1; j >= 0; j--) {
      const space = spaces[j];

      if (
        (rectangle.w > space.w || rectangle.h > space.h) &&
        (rectangle.h > space.w || rectangle.w > space.h)
      )
        continue;

      if (
        space.x + rectangle.w > containerWidth ||
        space.y + rectangle.h > containerHeight
      ) {
        // Try rotating the rectangle by 90 degrees
        if (
          rectangle.h <= space.w &&
          rectangle.w <= space.h &&
          rectangle.w <= containerWidth &&
          rectangle.h <= containerHeight
        ) {
          [rectangle.w, rectangle.h] = [rectangle.h, rectangle.w];
        } else {
          // Skip if the rectangle cannot fit in the space
          continue;
        }
      }

      if (rectangle.w <= space.w && rectangle.h <= space.h) {
        rectangle.left = space.x;
        rectangle.top = space.y;
        rectangle.right = space.x + rectangle.w;
        rectangle.bottom = space.y + rectangle.h;
      } else if (rectangle.h <= space.w && rectangle.w <= space.h) {
        rectangle.left = space.x;
        rectangle.top = space.y;
        rectangle.right = space.x + rectangle.h;
        rectangle.bottom = space.y + rectangle.w;
        [rectangle.w, rectangle.h] = [rectangle.h, rectangle.w];
      } else if (rectangle.w <= space.h && rectangle.h <= space.w) {
        rectangle.left = space.x;
        rectangle.top = space.y;
        rectangle.right = space.x + rectangle.h;
        rectangle.bottom = space.y + rectangle.w;
        [rectangle.w, rectangle.h] = [rectangle.h, rectangle.w];
      } else {
        // Skip if the rectangle cannot fit in the space
        continue;
      }

      width = Math.max(width, rectangle.right);
      height = Math.max(height, rectangle.bottom);

      if (rectangle.w === space.w && rectangle.h === space.h) {
        const last = spaces.pop();
        if (j < spaces.length) spaces[j] = last;
      } else if (rectangle.h === space.h) {
        space.x += rectangle.w;
        space.w -= rectangle.w;
      } else if (rectangle.w === space.w) {
        space.y += rectangle.h;
        space.h -= rectangle.h;
      } else {
        if (rectangle.h <= space.h) {
          spaces.push({
            x: space.x + rectangle.w,
            y: space.y,
            w: space.w - rectangle.w,
            h: rectangle.h,
          });
          space.y += rectangle.h;
          space.h -= rectangle.h;
        } else {
          spaces.push({
            x: space.x,
            y: space.y + space.h,
            w: rectangle.w,
            h: space.h,
          });
          space.w -= rectangle.w;
          space.h = rectangle.h;
        }
      }

      placements.push({
        top: rectangle.top,
        bottom: rectangle.bottom,
        left: rectangle.left,
        right: rectangle.right,
        index: i,
      });

      placed = true;
      break;
    }

    if (!placed) {
      // Handle case when a rectangle cannot be placed within the container
      if (containerWidth < rectangle.w || containerHeight < rectangle.h) {
        // Place the rectangle below the container
        rectangle.left = 0;
        rectangle.top = containerHeight;
        rectangle.right = rectangle.w;
        rectangle.bottom = containerHeight + rectangle.h;
        width = Math.max(width, rectangle.right);
        height = Math.max(height, rectangle.bottom);
        placements.push({
          top: rectangle.top,
          bottom: rectangle.bottom,
          left: rectangle.left,
          right: rectangle.right,
          index: i,
        });
        placed = true;
      } else {
        // Find the smallest space that can fit the rectangle
        let smallestSpace = null;
        let smallestDistance = Infinity;
        for (let j = spaces.length - 1; j >= 0; j--) {
          const space = spaces[j];
          if (rectangle.w <= space.w && rectangle.h <= space.h) {
            const distance =
              Math.abs(space.x - rectangle.w) + Math.abs(space.y - rectangle.h);
            if (distance < smallestDistance) {
              smallestSpace = space;
              smallestDistance = distance;
            }
          }
        }

        if (smallestSpace) {
          rectangle.left = smallestSpace.x;
          rectangle.top = smallestSpace.y;
          rectangle.right = smallestSpace.x + rectangle.w;
          rectangle.bottom = smallestSpace.y + rectangle.h;

          width = Math.max(width, rectangle.right);
          height = Math.max(height, rectangle.bottom);

          if (
            rectangle.w === smallestSpace.w &&
            rectangle.h === smallestSpace.h
          ) {
            const last = spaces.pop();
            if (j < spaces.length) spaces[j] = last;
          } else if (rectangle.h === smallestSpace.h) {
            smallestSpace.x += rectangle.w;
            smallestSpace.w -= rectangle.w;
          } else if (rectangle.w === smallestSpace.w) {
            smallestSpace.y += rectangle.h;
            smallestSpace.h -= rectangle.h;
          } else {
            if (rectangle.h <= smallestSpace.h) {
              spaces.push({
                x: smallestSpace.x + rectangle.w,
                y: smallestSpace.y,
                w: smallestSpace.w - rectangle.w,
                h: rectangle.h,
              });
              smallestSpace.y += rectangle.h;
              smallestSpace.h -= rectangle.h;
            } else {
              spaces.push({
                x: smallestSpace.x,
                y: smallestSpace.y + smallestSpace.h,
                w: rectangle.w,
                h: smallestSpace.h,
              });
              smallestSpace.w -= rectangle.w;
              smallestSpace.h = rectangle.h;
            }
          }

          placements.push({
            top: rectangle.top,
            bottom: rectangle.bottom,
            left: rectangle.left,
            right: rectangle.right,
            index: i,
          });

          placed = true;
        } else {
          console.log(
            `Cannot place rectangle with width ${rectangle.w} and height ${rectangle.h}`
          );
        }
      }
    }
  }

  // Calculate the total area of all rectangles
  for (let i = 0; i < rectangles.length; i++) {
    const rectangle = rectangles[i];
    totalArea += rectangle.w * rectangle.h;
  }

  // Calculate the empty area between rectangles
  for (let i = 0; i < placements.length - 1; i++) {
    const current = placements[i];
    const next = placements[i + 1];

    // Calculate the horizontal space between rectangles
    const horizontalSpace = next.left - current.right;

    if (horizontalSpace > 0) {
      // Calculate the vertical space between rectangles
      const verticalSpace =
        Math.min(current.bottom, next.bottom) - Math.max(current.top, next.top);

      // Only add the area if there is vertical space between rectangles
      if (verticalSpace > 0) {
        emptyArea += horizontalSpace * verticalSpace;
      }
    }
  }

  // Calculate the fullness coefficient
  const fullness = 1 - emptyArea / (totalArea + emptyArea);

  return {
    placements,
    fullness,
  };
}

const result = potpack(rectangles, window.innerWidth, window.innerHeight);

const body = document.body;

const fullness = document.createElement("div");
fullness.innerHTML = `Fullness: ${result.fullness * 100}%`;
body.appendChild(fullness);

const container = document.createElement("div");
container.style.position = "relative";
body.appendChild(container);

// Відобразити розміщення блоків
const colorMap = {};

result.placements.forEach((placement) => {
  const boxElement = document.createElement("div");
  boxElement.className = "box";
  boxElement.style.position = "absolute";
  boxElement.style.width = `${placement.right - placement.left}px`;
  boxElement.style.height = `${placement.bottom - placement.top}px`;
  boxElement.style.top = `${placement.top}px`;
  boxElement.style.left = `${placement.left}px`;

  const width = placement.right - placement.left;
  const height = placement.bottom - placement.top;

  let randomColor;
  if (colorMap[`${width}-${height}`]) {
    randomColor = colorMap[`${width}-${height}`];
  } else {
    randomColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
    colorMap[`${width}-${height}`] = randomColor;
  }

  boxElement.style.backgroundColor = randomColor;
  boxElement.style.display = "flex";
  boxElement.style.justifyContent = "center";
  boxElement.style.alignItems = "center";
  boxElement.innerHTML = placement.index;

  container.appendChild(boxElement);
});
