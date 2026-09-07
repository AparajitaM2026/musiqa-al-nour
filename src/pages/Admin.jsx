import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import CrudSection from '@/components/admin/CrudSection';
import UsersAdmin from '@/components/admin/UsersAdmin';
import BulkUpload from '@/components/admin/BulkUpload';
import { Music, Disc, Mic2, ListMusic, Users, ShieldCheck, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { key: 'tracks', label: 'Tracks', icon: Music },
  { key: 'albums', label: 'Albums', icon: Disc },
  { key: 'artists', label: 'Artists', icon: Mic2 },
  { key: 'playlists', label: 'Playlists', icon: ListMusic },
  { key: 'users', label: 'Users', icon: Users },
];

const CONFIGS = {
  tracks: {
    entity: 'Track',
    title: 'Track',
    searchKeys: ['title', 'title_ar', 'artist', 'artist_ar', 'album'],
    columns: [
      { key: 'isrc', label: 'ISRC' },
      { key: 'title', label: 'Title' },
      { key: 'artist', label: 'Artist' },
      { key: 'album', label: 'Album' },
      { key: 'genre', label: 'Genre' },
      { key: 'plays', label: 'Plays' },
    ],
    fields: [
      { key: 'isrc', label: 'ISRC' },
      { key: 'title', label: 'Title (EN)', required: true },
      { key: 'title_ar', label: 'Title (AR)' },
      { key: 'artist', label: 'Artist (EN)' },
      { key: 'artist_ar', label: 'Artist (AR)' },
      { key: 'album', label: 'Album (EN)' },
      { key: 'album_ar', label: 'Album (AR)' },
      { key: 'cover_url', label: 'Cover URL', type: 'url', full: true },
      { key: 'audio_url', label: 'Audio URL', type: 'url', required: true, full: true },
      { key: 'duration', label: 'Duration (s)', type: 'number' },
      { key: 'genre', label: 'Genre (EN)' },
      { key: 'genre_ar', label: 'Genre (AR)' },
      { key: 'playlist', label: 'Playlist (EN)' },
      { key: 'playlist_ar', label: 'Playlist (AR)' },
      {
        key: 'language',
        label: 'Language',
        type: 'select',
        options: [
          { value: 'ar', label: 'Arabic' },
          { value: 'en', label: 'English' },
        ],
      },
      { key: 'plays', label: 'Plays', type: 'number' },
      { key: 'composer', label: 'Composer (EN)' },
      { key: 'composer_ar', label: 'Composer (AR)' },
      { key: 'lyricist', label: 'Lyricist (EN)' },
      { key: 'lyricist_ar', label: 'Lyricist (AR)' },
      { key: 'label', label: 'Label' },
      { key: 'release_year', label: 'Release Year', type: 'number' },
      { key: 'maqam_genre', label: 'Maqam Genre' },
    ],
  },
  albums: {
    entity: 'Album',
    title: 'Album',
    searchKeys: ['title', 'title_ar', 'artist', 'artist_ar'],
    columns: [
      { key: 'upc', label: 'UPC' },
      { key: 'title', label: 'Title' },
      { key: 'artist', label: 'Artist' },
      { key: 'release_year', label: 'Year' },
      { key: 'genre', label: 'Genre' },
    ],
    fields: [
      { key: 'upc', label: 'UPC' },
      { key: 'title', label: 'Title (EN)', required: true },
      { key: 'title_ar', label: 'Title (AR)' },
      { key: 'artist', label: 'Artist (EN)' },
      { key: 'artist_ar', label: 'Artist (AR)' },
      { key: 'cover_url', label: 'Cover URL', type: 'url', full: true },
      { key: 'release_year', label: 'Release Year', type: 'number' },
      { key: 'genre', label: 'Genre' },
    ],
  },
  artists: {
    entity: 'Artist',
    title: 'Artist',
    searchKeys: ['name', 'name_ar'],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'genre', label: 'Genre' },
      { key: 'monthly_listeners', label: 'Listeners' },
    ],
    fields: [
      { key: 'name', label: 'Name (EN)', required: true },
      { key: 'name_ar', label: 'Name (AR)' },
      { key: 'image_url', label: 'Image URL', type: 'url', full: true },
      { key: 'bio', label: 'Bio (EN)', type: 'textarea', full: true },
      { key: 'bio_ar', label: 'Bio (AR)', type: 'textarea', full: true },
      {
        key: 'genre',
        label: 'Genre',
        type: 'select',
        options: [
          { value: 'khaliji', label: 'Khaliji' },
          { value: 'swahili', label: 'Swahili' },
          { value: 'egyptian', label: 'Egyptian' },
          { value: 'other', label: 'Other' },
        ],
      },
      { key: 'monthly_listeners', label: 'Monthly Listeners', type: 'number' },
    ],
  },
  playlists: {
    entity: 'Playlist',
    title: 'Playlist',
    searchKeys: ['title', 'title_ar'],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'genre', label: 'Genre' },
      { key: 'track_ids', label: 'Tracks', render: (r) => (r.track_ids?.length || 0) },
    ],
    fields: [
      { key: 'title', label: 'Title (EN)', required: true },
      { key: 'title_ar', label: 'Title (AR)' },
      { key: 'description', label: 'Description (EN)', type: 'textarea', full: true },
      { key: 'description_ar', label: 'Description (AR)', type: 'textarea', full: true },
      { key: 'cover_url', label: 'Cover URL', type: 'url', full: true },
      { key: 'genre', label: 'Genre' },
      { key: 'track_ids', label: 'Track IDs (comma separated)', type: 'array', full: true },
    ],
  },
};

export default function Admin() {
  const { user } = useAuth();
  const [tab, setTab] = useState('tracks');
  const [bulkOpen, setBulkOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user || user.role !== 'admin') {
    return (
      <div className="h-full grid place-items-center p-8 text-center">
        <div>
          <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Admin access required.</p>
        </div>
      </div>
    );
  }

  const cfg = CONFIGS[tab];

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your music catalog and users</p>
        </div>
        <Button variant="outline" onClick={() => setBulkOpen(true)}>
          <Upload className="w-4 h-4 me-2" /> Bulk Upload
        </Button>
      </div>

      <BulkUpload
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        onDone={() => setRefreshKey((k) => k + 1)}
      />

      <div className="flex gap-1 overflow-x-auto pb-2 mb-6 border-b border-border">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            type="button"
            onClick={() => setTab(tb.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
              tab === tb.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <tb.icon className="w-4 h-4" /> {tb.label}
          </button>
        ))}
      </div>

      {tab === 'users' ? (
        <UsersAdmin />
      ) : (
        <CrudSection
          key={`${tab}-${refreshKey}`}
          entityName={cfg.entity}
          title={cfg.title}
          fields={cfg.fields}
          columns={cfg.columns}
          searchKeys={cfg.searchKeys}
        />
      )}
    </div>
  );
}