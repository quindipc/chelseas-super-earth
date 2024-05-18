# Chelsea's Super Earth

This is a practice project of creating earth in threejs and nextjs and documenting my struggles along the way.

## Problems Encountered

### Importing Image Texture Problem

When you import an image in a Next.js project, especially using Next.js's next/image module, the imported value is not a direct URL string pointing to the image file. Instead, it's an object containing metadata about the image, including its URL (src), dimensions (height and width), and other properties.

You might get this error:

`GET http://localhost:3000/[object%20Object] 40(Not Found)`

To use the imported image with TextureLoader, you need to extract the URL of the image from the imported object. This URL is stored in the src property of the imported image object.

Once you have extracted the URL of the image, you can pass it to TextureLoader.load() to load the image file and create a texture. This ensures that TextureLoader receives a valid URL string as input.

```
// Import the image path
import earthTextureImage from "../assets/00_earthmap1k.jpg";

// Extract the URL of the image
const earthTextureImageUrl = earthTextureImage.src;

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Load the texture using the image URL
const earthTexture = textureLoader.load(earthTextureImageUrl);
```

### Creating the lights material

When creating a new material to overlay the earth like the lights material, adding an opacity can help offset the low quality image that is used and make the lights not stand out as much.

````const lightsMaterial = new THREE.MeshBasicMaterial({
     map: lightsTexture,
     blending: THREE.AdditiveBlending,
     opacity: 0.4,
   });```

## Attributions

Images taken frm: [Planet Pixel Emporium](https://planetpixelemporium.com/earth.html)
Three.js Tutorial using HTML & JS from [Robot Bobby](https://www.youtube.com/watch?v=FntV9iEJ0tU&ab_channel=RobotBobby)


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
````

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
