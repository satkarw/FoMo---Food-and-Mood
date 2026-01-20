"use client"

// ============================================
// ProfilePage Component
// A beautifully designed user profile page with
// profile picture upload, favourite foods management,
// and user posts display
// ============================================

import PostCard from "../../feed/components/PostCard"
import { useAuth } from "@/context/AuthContext"
import { Camera, Loader2, User, Plus, X, Heart, ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { apiFetch } from "../../lib/api"
import prof from "../prof.jpg"
import FoodSearchInput from "../../components/FoodSearchInput"
import FeedPage from "../../feed/page"
import { useParams, useRouter } from "next/navigation"

// ============================================
// Color Palette (based on #FF6B35)
// Primary: #FF6B35 (Vibrant Orange)
// Primary Hover: #E55A25 (Darker Orange)
// Background: #FFF8F5 (Warm White)
// Card: #FFFFFF (Pure White)
// Text Primary: #1F2937 (Dark Gray)
// Text Secondary: #6B7280 (Medium Gray)
// Border: #FED7C3 (Light Orange Tint)
// ============================================

export default function ProfilePage({ userId: propUserId = null }) {
    // ============================================
    // Authentication & State Management
    // ============================================
    const { user: currentUser, loading: authLoading } = useAuth()
    const [profile, setProfile] = useState({})
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [profileLoading, setProfileLoading] = useState(true)
    const [profileError, setProfileError] = useState(null)
    const [isUploading, setIsUploading] = useState(false)

    // Food search state
    const [foodSearchQuery, setFoodSearchQuery] = useState('')
    const [selectedFood, setSelectedFood] = useState(null)
    const [favFoods, setFavFoods] = useState([])
    const [isAddingFood, setIsAddingFood] = useState(false)

    // Navigation hooks
    const params = useParams()
    const router = useRouter()
    
    // ============================================
    // User Identification Logic
    // Priority: propUserId > URL params > currentUser
    // ============================================
    const viewingUserId = propUserId || params?.userId || (currentUser ? currentUser.id : null)
    const isOwnProfile = currentUser && viewingUserId && currentUser.id.toString() === viewingUserId.toString()

    // ============================================
    // Utility Functions
    // ============================================
    
    // Formats name with first letter capitalized
    const formatName = (name) => {
        if (!name) return ""
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    }

    // Get full display name
    const getDisplayName = () => {
        const firstName = formatName(profile.user?.first_name || profile.first_name)
        const lastName = formatName(profile.user?.last_name || profile.last_name)
        return `${firstName} ${lastName}`.trim() || "Anonymous User"
    }

    // ============================================
    // Data Fetching
    // ============================================
    
    useEffect(() => {
        if (viewingUserId) {
            fetchProfile()
        }
    }, [viewingUserId])

    const fetchProfile = async () => {
        if (!viewingUserId) return
        
        try {
            setProfileLoading(true)
            setProfileError(null)
            
            // Use different endpoint based on profile ownership
            const endpoint = isOwnProfile 
                ? 'profile/my/' 
                : `profile/${viewingUserId}/`
            
            const response = await apiFetch(endpoint)
            setProfile(response)
        } catch (err) {
            console.log("Failed to fetch profile:", err)
            setProfileError("Failed to load profile. Please try again.")
        } finally {
            setProfileLoading(false)
        }
    }

    // Sync favourite foods from profile data
    useEffect(() => {
        if (profile?.favourite_foods) {
            setFavFoods(profile.favourite_foods)
        }
    }, [profile.favourite_foods])

    // ============================================
    // Profile Picture Handlers
    // ============================================

    const handleImageSelect = (e) => {
        if (!isOwnProfile) return
        
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleProfileChange = async () => {
        if (!isOwnProfile || !selectedImage) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append("profile_picture", selectedImage)

        try {
            await apiFetch("profile/my/", {
                method: "PATCH",
                body: formData,
                headers: {},
            })
            fetchProfile()
            setSelectedImage(null)
            setImagePreview(null)
        } catch (err) {
            console.error("Failed to update profile:", err)
        } finally {
            setIsUploading(false)
        }
    }

    const cancelImageChange = () => {
        setSelectedImage(null)
        setImagePreview(null)
    }

    // ============================================
    // Favourite Food Handlers
    // ============================================

    const removeFromFavourite = async (e, id) => {
        e.preventDefault()
        if (!isOwnProfile) return

        try {
            await apiFetch(`profile/myFavourites/${id}`, { method: 'POST' })
            setFavFoods((prev) => prev.filter(i => i.id !== id))
        } catch (err) {
            console.log("Failed to update favourites")
        }
    }

    const handleAddFavourite = async (e) => {
        e.preventDefault()
        if (!isOwnProfile || !selectedFood) return

        setIsAddingFood(true)
        try {
            let foodId = null
            let foodName = ""

            // Handle custom food creation
            if (selectedFood.isCustom) {
                const res = await apiFetch("menu/food/get-or-create/", {
                    method: "POST",
                    body: JSON.stringify({ name: selectedFood.name }),
                    headers: { "Content-Type": "application/json" },
                })
                foodId = res.food.id
                foodName = res.food.name
            } else {
                // Use existing menu food
                foodId = selectedFood.food.id
                foodName = selectedFood.food.name
            }

            // Add to favourites via API
            await apiFetch(`profile/myFavourites/${foodId}`, { method: "POST" })

            // Update local state
            setFavFoods((prev) => [...prev, { id: foodId, name: foodName }])
            setSelectedFood(null)
            setFoodSearchQuery("")
        } catch (error) {
            console.error("Could not add favourite food", error)
        } finally {
            setIsAddingFood(false)
        }
    }

    // ============================================
    // Loading State UI
    // ============================================
    if (authLoading || profileLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col justify-center items-center">
                {/* Animated loading spinner */}
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-orange-100"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-transparent border-t-[#FF6B35] animate-spin"></div>
                </div>
                <p className="mt-6 text-gray-500 font-medium animate-pulse">Loading profile...</p>
            </div>
        )
    }

    // ============================================
    // Error State UI
    // ============================================
    if (profileError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    {/* Error icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
                        <User className="w-10 h-10 text-[#FF6B35]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Profile Not Found</h2>
                    <p className="text-gray-500 mb-6">{profileError}</p>
                    <button 
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#E55A25] transition-all duration-300 shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-0.5"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    // ============================================
    // Empty Profile State UI
    // ============================================
    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">User Not Found</h2>
                    <p className="text-gray-500">The profile you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }

    // ============================================
    // Main Profile UI
    // ============================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF6B35] opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF6B35] opacity-5 rounded-full blur-3xl"></div>
            </div>

            {/* Main content container */}
            <div className="relative max-w-2xl mx-auto pt-8 pb-16 px-4 sm:px-6">
                
                {/* ================================
                    Profile Header Card
                    Contains profile picture and name
                ================================ */}
                <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-8 mb-6 overflow-hidden">
                    {/* Orange accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] via-orange-400 to-[#FF6B35]"></div>
                    
                    <div className="flex flex-col items-center">
                        {/* Profile Picture Section */}
                        <div className="relative group">
                            {/* Profile image with border */}
                            <div className="relative">
                                <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-br from-[#FF6B35] to-orange-400 shadow-lg shadow-orange-200">
                                    <img
                                        src={imagePreview || profile.profile_picture || prof.src}
                                        alt="Profile Picture"
                                        className="w-full h-full rounded-full object-cover bg-white"
                                    />
                                </div>
                                
                                {/* Camera overlay for own profile */}
                                {isOwnProfile && !selectedImage && (
                                    <label 
                                        htmlFor="profile-picture" 
                                        className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center cursor-pointer transition-all duration-300"
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center text-white">
                                            <Camera className="w-8 h-8 mb-1" />
                                            <span className="text-sm font-medium">Change</span>
                                        </div>
                                    </label>
                                )}

                                {/* Online indicator (optional visual) */}
                                {isOwnProfile && (
                                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
                                )}
                            </div>

                            {/* Hidden file input */}
                            {isOwnProfile && (
                                <input
                                    id="profile-picture"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            )}
                        </div>

                        {/* Save/Cancel buttons for image change */}
                        {selectedImage && (
                            <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <button 
                                    onClick={handleProfileChange}
                                    disabled={isUploading}
                                    className="px-5 py-2.5 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#E55A25] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Photo'
                                    )}
                                </button>
                                <button 
                                    onClick={cancelImageChange}
                                    disabled={isUploading}
                                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {/* User name and badge */}
                        <div className="mt-6 text-center">
                            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                                {getDisplayName()}
                            </h1>
                            {isOwnProfile && (
                                <span className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 bg-orange-50 text-[#FF6B35] text-sm font-semibold rounded-full">
                                    <User className="w-4 h-4" />
                                    Your Profile
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* ================================
                    Favourite Foods Section
                    Only editable for own profile
                ================================ */}
                <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-6 mb-6">
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-orange-400 flex items-center justify-center shadow-md shadow-orange-200">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Favourite Foods</h2>
                    </div>

                    {/* Add food input (own profile only) */}
                    {isOwnProfile && (
                        <div className="flex gap-3 mb-5">
                            <div className="flex-1">
                                <FoodSearchInput
                                    value={foodSearchQuery}
                                    onChange={setFoodSearchQuery}
                                    onFoodSelect={(food) => setSelectedFood(food)}
                                    className="w-full"
                                    placeholder="Search and add a favourite food..."
                                />
                            </div>
                            <button 
                                onClick={handleAddFavourite}
                                disabled={!selectedFood || isAddingFood}
                                className="px-5 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#E55A25] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                            >
                                {isAddingFood ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Add
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Favourite foods tags */}
                    {favFoods.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {favFoods.map((item) => (
                                <div
                                    key={item.id}
                                    className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 rounded-full transition-all duration-300 hover:shadow-md hover:border-[#FF6B35]/30"
                                >
                                    <span className="text-gray-700 font-medium">{item.name}</span>
                                    
                                    {/* Remove button (own profile only) */}
                                    {isOwnProfile && (
                                        <button 
                                            onClick={(e) => removeFromFavourite(e, item.id)}
                                            className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
                                            title="Remove from favourites"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No favourite foods yet</p>
                            {isOwnProfile && (
                                <p className="text-sm mt-1">Add your favourite foods above!</p>
                            )}
                        </div>
                    )}
                </div>

                {/* ================================
                    User Posts Section
                    Displays posts from FeedPage component
                ================================ */}
                <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/50 p-6">
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-orange-400 flex items-center justify-center shadow-md shadow-orange-200">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {isOwnProfile ? 'Your Posts' : `${formatName(profile.user?.first_name || profile.first_name)}'s Posts`}
                        </h2>
                    </div>

                    {/* Posts feed */}
                    <FeedPage userId={viewingUserId} />
                </div>
            </div>
        </div>
    )
}
