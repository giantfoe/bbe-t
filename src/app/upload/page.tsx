"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Upload, 
  X, 
  Plus, 
  Image as ImageIcon,
  DollarSign,
  Tag,
  FileText,
  Palette,
  Ruler,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react";

interface ArtworkFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  medium: string;
  dimensions: {
    width: string;
    height: string;
    depth: string;
  };
  yearCreated: string;
  tags: string[];
  isLimitedEdition: boolean;
  editionSize: string;
  isForSale: boolean;
  images: File[];
}

const categories = [
  "Digital Art",
  "Painting",
  "Photography",
  "Sculpture",
  "Drawing",
  "Mixed Media",
  "Printmaking",
  "Textile Art",
  "Ceramics",
  "Other"
];

const mediums = [
  "Oil on Canvas",
  "Acrylic on Canvas",
  "Watercolor",
  "Digital",
  "Photography",
  "Charcoal",
  "Pencil",
  "Ink",
  "Mixed Media",
  "Bronze",
  "Marble",
  "Wood",
  "Other"
];

export default function UploadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ArtworkFormData>({
    title: "",
    description: "",
    price: "",
    category: "",
    medium: "",
    dimensions: {
      width: "",
      height: "",
      depth: ""
    },
    yearCreated: new Date().getFullYear().toString(),
    tags: [],
    isLimitedEdition: false,
    editionSize: "",
    isForSale: true,
    images: []
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ArtworkFormData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    const newPreviews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === files.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement actual artwork upload with Convex
      // 1. Upload images to Convex file storage
      // 2. Create artwork record with Convex mutation
      
      // For now, show success message and redirect
      alert('Artwork uploaded successfully!');
      
      // Redirect to dashboard
      router.push("/dashboard?tab=artworks&uploaded=true");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.images.length > 0;
      case 2:
        return formData.title && formData.description && formData.category;
      case 3:
        return formData.price && formData.medium;
      default:
        return true;
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= step
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-600"
          }`}>
            {step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > step ? "bg-blue-600" : "bg-gray-200"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const Step1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Artwork</h2>
        <p className="text-gray-600">Add up to 5 high-quality images of your artwork</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="space-y-4">
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drop images here or click to upload</p>
              <p className="text-sm text-gray-600">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </label>
          
          <div className="text-sm text-gray-500">
            <p>• First image will be the main display image</p>
            <p>• Use high-resolution images for best quality</p>
            <p>• Show different angles or details</p>
          </div>
        </div>

        {/* Image Previews */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Uploaded Images ({formData.images.length}/5)</h3>
          <div className="grid grid-cols-2 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Artwork Details</h2>
        <p className="text-gray-600">Provide information about your artwork</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter artwork title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="h-4 w-4 inline mr-1" />
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="h-4 w-4 inline mr-1" />
              Medium
            </label>
            <select
              value={formData.medium}
              onChange={(e) => handleInputChange('medium', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select medium</option>
              {mediums.map(medium => (
                <option key={medium} value={medium}>{medium}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Year Created
            </label>
            <input
              type="number"
              value={formData.yearCreated}
              onChange={(e) => handleInputChange('yearCreated', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your artwork, inspiration, technique, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Ruler className="h-4 w-4 inline mr-1" />
              Dimensions (inches)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={formData.dimensions.width}
                onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
                placeholder="Width"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={formData.dimensions.height}
                onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
                placeholder="Height"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                value={formData.dimensions.depth}
                onChange={(e) => handleInputChange('dimensions.depth', e.target.value)}
                placeholder="Depth"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Availability</h2>
        <p className="text-gray-600">Set your pricing and sale options</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isForSale"
            checked={formData.isForSale}
            onChange={(e) => handleInputChange('isForSale', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isForSale" className="flex items-center text-sm font-medium text-gray-700">
            {formData.isForSale ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
            Available for sale
          </label>
        </div>

        {formData.isForSale && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Price (USD) *
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        )}

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isLimitedEdition"
            checked={formData.isLimitedEdition}
            onChange={(e) => handleInputChange('isLimitedEdition', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isLimitedEdition" className="text-sm font-medium text-gray-700">
            Limited Edition
          </label>
        </div>

        {formData.isLimitedEdition && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edition Size
            </label>
            <input
              type="number"
              value={formData.editionSize}
              onChange={(e) => handleInputChange('editionSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 100"
              min="1"
            />
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Commission Information</h3>
          <p className="text-sm text-gray-600 mb-2">
            ArtVault charges a 10% commission on all sales. You will receive 90% of the sale price.
          </p>
          {formData.price && (
            <div className="text-sm">
              <p className="text-gray-600">Sale Price: ${formData.price}</p>
              <p className="text-gray-600">Commission (10%): ${(parseFloat(formData.price) * 0.1).toFixed(2)}</p>
              <p className="font-medium text-gray-900">You Receive: ${(parseFloat(formData.price) * 0.9).toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <StepIndicator />
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-8">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className={`px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${
                currentStep === 1 ? "invisible" : ""
              }`}
            >
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!isStepValid(currentStep)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !isStepValid(currentStep)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  "Upload Artwork"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}