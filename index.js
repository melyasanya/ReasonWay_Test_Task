console.log(window.innerHeight);
console.log(window.innerWidth);

const randomColor = Math.floor(Math.random() * 16777215).toString(16);

function potpack(rectangles, containerWidth, containerHeight) {
  rectangles.sort((a, b) => b.h - a.h);

  const spaces = [{ x: 0, y: 0, w: containerWidth, h: containerHeight }];
  const placements = [];

  let width = 0;
  let height = 0;

  for (const rectangle of rectangles) {
    let placed = false;

    for (let i = spaces.length - 1; i >= 0; i--) {
      const space = spaces[i];

      if (
        (rectangle.w > space.w || rectangle.h > space.h) &&
        (rectangle.h > space.w || rectangle.w > space.h)
      )
        continue;

      if (
        space.x + rectangle.w > containerWidth ||
        space.y + rectangle.h > containerHeight
      ) {
        // Skip if the rectangle exceeds the container boundaries
        continue;
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
        if (i < spaces.length) spaces[i] = last;
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
      });

      placed = true;
      break;
    }

    if (!placed) {
      // Handle case when a rectangle cannot be placed within the container
      if (containerWidth < rectangle.w) {
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
        });
        placed = true;
      } else {
        console.log(
          `Cannot place rectangle with width ${rectangle.w} and height ${rectangle.h}`
        );
      }
    }
  }

  return {
    w: Math.min(width, containerWidth),
    h: Math.min(height, containerHeight),
    placements: placements,
  };
}
const rectangles = [
  {
    w: 140,
    h: 200,
  },
  {
    w: 200,
    h: 140,
  },
  {
    w: 93,
    h: 56,
  },
  {
    w: 78,
    h: 103,
  },
  {
    w: 78,
    h: 103,
  },

  {
    w: 78,
    h: 103,
  },

  {
    w: 78,
    h: 103,
  },

  {
    w: 78,
    h: 103,
  },

  {
    w: 78,
    h: 103,
  },
];

const result = potpack(rectangles, window.innerWidth, window.innerHeight);

console.log(result);

const container = document.body;

// Встановити розміри контейнера відповідно до результату

// Відобразити розміщення блоків
result.placements.forEach((placement, index) => {
  const boxElement = document.createElement("div");
  boxElement.className = "box";
  boxElement.style.position = "absolute";
  boxElement.style.width = `${placement.right - placement.left}px`;
  boxElement.style.height = `${placement.bottom - placement.top}px`;
  boxElement.style.top = `${placement.top}px`;
  boxElement.style.left = `${placement.left}px`;
  boxElement.style.backgroundColor = `#${Math.floor(
    Math.random() * 16777215
  ).toString(16)}`;
  // Додати інші стилі або вміст за потреби

  container.appendChild(boxElement);
});
