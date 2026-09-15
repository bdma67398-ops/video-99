import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { VideoItem, AdSettings } from '../types';
import { INITIAL_VIDEOS, INITIAL_AD_SETTINGS } from '../data/initialData';

const VIDEOS_COLLECTION = 'videos';
const SETTINGS_COLLECTION = 'settings';
const GLOBAL_SETTINGS_DOC = 'ad_settings';

// Track if initial seeding was checked
let isSeededChecked = false;

// Subscribe to real-time videos collection
export function subscribeToVideos(callback: (videos: VideoItem[]) => void) {
  const q = query(collection(db, VIDEOS_COLLECTION), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    async (snapshot) => {
      // If collection is empty and we haven't checked seed yet, seed it once
      if (snapshot.empty && !isSeededChecked) {
        isSeededChecked = true;
        const alreadySeededBefore = localStorage.getItem('portal_has_seeded');
        if (!alreadySeededBefore) {
          localStorage.setItem('portal_has_seeded', 'true');
          await seedInitialVideos();
        } else {
          // User deliberately deleted all videos, respect empty array
          callback([]);
          return;
        }
        return;
      }

      const list: VideoItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          title: data.title || '',
          description: data.description || '',
          videoUrl: data.videoUrl || '',
          thumbnailUrl: data.thumbnailUrl || '',
          duration: data.duration || '05:00',
          views: typeof data.views === 'number' ? data.views : 0,
          uploadDate: data.uploadDate || 'সম্প্রতি',
          category: data.category || 'সাধারণ'
        });
      });

      callback(list);
    },
    (error) => {
      console.error('Firestore videos listener error:', error);
      // Fallback to local storage or initial data on network failure
      const saved = localStorage.getItem('portal_videos');
      if (saved) {
        try {
          callback(JSON.parse(saved));
        } catch {
          callback(INITIAL_VIDEOS);
        }
      } else {
        callback(INITIAL_VIDEOS);
      }
    }
  );

  return unsubscribe;
}

// Subscribe to real-time Ad Settings
export function subscribeToAdSettings(callback: (settings: AdSettings) => void) {
  const docRef = doc(db, SETTINGS_COLLECTION, GLOBAL_SETTINGS_DOC);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as AdSettings;
        callback({
          ...INITIAL_AD_SETTINGS,
          ...data
        });
      } else {
        saveAdSettingsToFirestore(INITIAL_AD_SETTINGS).catch(() => {});
        callback(INITIAL_AD_SETTINGS);
      }
    },
    (error) => {
      console.error('Firestore adSettings listener error:', error);
      const saved = localStorage.getItem('portal_ad_settings');
      callback(saved ? JSON.parse(saved) : INITIAL_AD_SETTINGS);
    }
  );

  return unsubscribe;
}

// Add or update video in Firestore (Visible to all users worldwide)
export async function addVideoToFirestore(video: VideoItem): Promise<void> {
  const videoId = video.id || 'vid-' + Date.now();
  const docRef = doc(db, VIDEOS_COLLECTION, videoId);
  
  await setDoc(docRef, {
    id: videoId,
    title: video.title,
    description: video.description || '',
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl || '',
    duration: video.duration || '05:00',
    views: video.views || 1,
    uploadDate: video.uploadDate || 'এইমাত্র',
    category: video.category || 'সাধারণ',
    createdAt: Date.now(),
    serverTimestamp: serverTimestamp()
  }, { merge: true });
}

// Delete video from Firestore
export async function deleteVideoFromFirestore(videoId: string): Promise<void> {
  if (!videoId) return;
  const docRef = doc(db, VIDEOS_COLLECTION, videoId);
  await deleteDoc(docRef);
}

// Save ad settings to Firestore
export async function saveAdSettingsToFirestore(settings: AdSettings): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, GLOBAL_SETTINGS_DOC);
  await setDoc(docRef, settings, { merge: true });
}

// Seed initial videos
export async function seedInitialVideos() {
  try {
    for (let i = 0; i < INITIAL_VIDEOS.length; i++) {
      const vid = INITIAL_VIDEOS[i];
      const docRef = doc(db, VIDEOS_COLLECTION, vid.id);
      await setDoc(docRef, {
        ...vid,
        createdAt: Date.now() - (i * 60000)
      }, { merge: true });
    }
  } catch (err) {
    console.warn('Seeding initial videos error:', err);
  }
}
