import { mutation } from "./_generated/server";
import { v } from "convex/values";

type ArtworkCategory = "painting" | "photography" | "digital" | "sculpture" | "drawing" | "mixed-media";

const generateFillerArtworks = () => {
  const categories: ArtworkCategory[] = ["painting", "photography", "digital", "sculpture", "drawing", "mixed-media"];
  const mediums: Record<ArtworkCategory, string[]> = {
    painting: ["Oil on canvas", "Acrylic on canvas", "Watercolor on paper", "Tempera on wood"],
    photography: ["Digital photography", "Film photography", "Polaroid", "Large format print"],
    digital: ["Digital art", "3D rendering", "AI-generated art", "Digital collage"],
    sculpture: ["Bronze", "White marble", "Clay", "Steel", "Wood", "Glass"],
    drawing: ["Graphite on paper", "Charcoal on paper", "Ink on paper", "Colored pencil"],
    "mixed-media": ["Acrylic and collage", "Digital print and paint", "Found objects and paint", "Mixed materials"]
  };
  
  const adjectives = ["Abstract", "Vibrant", "Serene", "Dynamic", "Ethereal", "Bold", "Delicate", "Mysterious", "Luminous", "Textured"];
  const nouns = ["Harmony", "Solitude", "Dreams", "Elegance", "Whisper", "Reality", "Depths", "Lights", "Shadows", "Reflections", "Memories", "Journey", "Symphony", "Essence", "Vision", "Spirit", "Rhythm", "Balance", "Energy", "Tranquility"];
  
  const descriptions = [
    "A captivating piece that explores the relationship between color and emotion through bold artistic expression.",
    "An intricate work that captures the essence of human experience with masterful technique and vision.",
    "A contemporary interpretation of classical themes, blending traditional methods with modern sensibilities.",
    "An experimental artwork that challenges conventional boundaries and invites contemplation.",
    "A stunning visual narrative that tells a story through careful composition and artistic skill.",
    "A mesmerizing creation that draws viewers into a world of imagination and artistic beauty.",
    "An innovative piece that demonstrates the artist's unique perspective and technical mastery.",
    "A thought-provoking work that examines themes of identity, nature, and human connection.",
    "A dynamic composition that showcases the interplay between light, shadow, and form.",
    "An elegant expression of artistic vision that resonates with both emotion and intellect."
  ];
  
  const tags: Record<ArtworkCategory, string[]> = {
    painting: ["abstract", "colorful", "modern", "vibrant", "expressionist", "impressionist", "contemporary", "traditional"],
    photography: ["urban", "nature", "portrait", "landscape", "street", "architectural", "documentary", "artistic"],
    digital: ["futuristic", "technology", "contemporary", "innovative", "cyber", "virtual", "AI", "experimental"],
    sculpture: ["contemporary", "elegant", "monumental", "abstract", "figurative", "minimalist", "textured", "organic"],
    drawing: ["detailed", "botanical", "portrait", "architectural", "abstract", "realistic", "expressive", "minimalist"],
    "mixed-media": ["experimental", "contemporary", "innovative", "collage", "textural", "layered", "conceptual", "multimedia"]
  };
  
  const imageUrls = [
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551913902-c92207136625?w=800&h=600&fit=crop"
  ];
  
  const artworks = [];
  
  for (let i = 0; i < 100; i++) {
    const category = categories[i % categories.length];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const title = `${adjective} ${noun} ${i > 19 ? (i + 1) : ''}`;
    
    const medium = mediums[category][Math.floor(Math.random() * mediums[category].length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const categoryTags = tags[category];
    const selectedTags = categoryTags.slice(0, 3 + Math.floor(Math.random() * 2));
    
    const basePrice = category === "sculpture" ? 2000 : category === "painting" ? 1000 : category === "photography" ? 400 : category === "digital" ? 600 : category === "drawing" ? 250 : 800;
    const priceVariation = Math.floor(Math.random() * basePrice * 0.8) + basePrice * 0.6;
    
    const width = 30 + Math.floor(Math.random() * 70);
    const height = 30 + Math.floor(Math.random() * 90);
    const depth = category === "sculpture" || category === "mixed-media" ? 5 + Math.floor(Math.random() * 30) : undefined;
    
    const artwork = {
       title,
       description,
       category,
       medium,
       dimensions: depth ? { width, height, depth, unit: "cm" as const } : { width, height, unit: "cm" as const },
       price: Math.round(priceVariation),
       currency: "USD",
       images: [
         {
           url: imageUrls[i % imageUrls.length],
           alt: `${title} - ${category}`,
           isPrimary: true
         }
       ],
       tags: selectedTags,
       isAvailable: Math.random() > 0.1,
       isFeatured: Math.random() > 0.7,
       yearCreated: 2020 + Math.floor(Math.random() * 5),
       ...(Math.random() > 0.8 && { edition: { current: 1, total: Math.floor(Math.random() * 10) + 2 } })
     };
    
    artworks.push(artwork);
  }
  
  return artworks;
};

const fillerArtworks = generateFillerArtworks();

export const seedArtworks = mutation({
  args: {},
  handler: async (ctx) => {
    // First, let's get some users to assign as artists
    const users = await ctx.db.query("users").collect();
    
    if (users.length === 0) {
      throw new Error("No users found. Please create some users first before seeding artworks.");
    }

    // Filter for artist users, or use any user if no artists exist
    const artists = users.filter(user => user.role === "artist");
    const availableArtists = artists.length > 0 ? artists : users;

    const now = Date.now();
    const createdArtworks = [];

    for (let i = 0; i < fillerArtworks.length; i++) {
      const artwork = fillerArtworks[i];
      const artistIndex = i % availableArtists.length;
      const artist = availableArtists[artistIndex];

      const artworkData = {
        ...artwork,
        artistId: artist._id,
        createdAt: now,
        updatedAt: now
      };

      const artworkId = await ctx.db.insert("artworks", artworkData);
      createdArtworks.push(artworkId);
    }

    return {
      success: true,
      message: `Successfully created ${createdArtworks.length} filler artworks`,
      artworkIds: createdArtworks
    };
  },
});

export const clearArtworks = mutation({
  args: {},
  handler: async (ctx) => {
    const artworks = await ctx.db.query("artworks").collect();
    
    for (const artwork of artworks) {
      await ctx.db.delete(artwork._id);
    }

    return {
      success: true,
      message: `Successfully deleted ${artworks.length} artworks`
    };
  },
});