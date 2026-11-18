import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { env } from '../config/env.js'

// Configure cloudinary directly here to avoid import issues
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key:    env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

// Use memoryStorage and upload manually to Cloudinary
const storage = multer.memoryStorage()

function rejection(message) {
  const err = new Error(message)
  err.statusCode = 400
  return err
}

// Avatars — images only
const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']
function avatarFilter(req, file, cb) {
  if (!AVATAR_TYPES.includes(file.mimetype)) {
    return cb(rejection('Only JPG, PNG or WebP images are allowed.'))
  }
  cb(null, true)
}

// Resources — documents, slides, spreadsheets and images
const RESOURCE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/webp',
]
function resourceFilter(req, file, cb) {
  if (!RESOURCE_TYPES.includes(file.mimetype)) {
    return cb(rejection('This file type is not allowed. Use PDF, Word, PowerPoint, Excel, TXT or an image.'))
  }
  cb(null, true)
}

export const uploadAvatar   = multer({ storage, limits: { fileSize: 5  * 1024 * 1024 }, fileFilter: avatarFilter })
export const uploadResource = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 }, fileFilter: resourceFilter })

// Helper — call this in your controller after multer runs
export async function uploadToCloudinary(fileBuffer, folder, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) reject(error)
        else resolve({ url: result.secure_url, publicId: result.public_id })
      }
    )
    stream.end(fileBuffer)
  })
}

export async function deleteFromCloudinary(publicId, resourceType = 'image') {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch (err) {
    console.error('Cloudinary delete error:', err.message)
  }
}
