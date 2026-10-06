import React, { useState, useRef, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Upload,
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

const TARGETS = [
  { key: 'isrc', label: 'ISRC', required: true, group: 'track', aliases: ['isrc'] },
  { key: 'title', label: 'Track Title', required: true, group: 'track', aliases: ['title', 'track_title', 'track title', 'track', 'name', 'song', 'song name', 'track name'] },
  { key: 'title_ar', label: 'Track Title (AR)', group: 'track', aliases: ['title_ar', 'arabic title', 'title (arabic)', 'title arabic', 'track_title_ar'] },
  { key: 'artist', label: 'Track Artist', group: 'track', aliases: ['artist', 'track_artist', 'track artist', 'performer', 'artist name', 'artists'] },
  { key: 'artist_ar', label: 'Track Artist (AR)', group: 'track', aliases: ['artist_ar', 'arabic artist', 'artist (arabic)', 'artist arabic'] },
  { key: 'cover_url', label: 'Track Cover URL', group: 'track', aliases: ['cover_url', 'cover', 'cover url', 'cover image', 'artwork', 'image', 'image_url', 'img', 'photo', 'picture', 'thumbnail', 'cover_image', 'cover_art', 'cover art'] },
  { key: 'audio_url', label: 'Audio URL', required: true, group: 'track', aliases: ['audio_url', 'audio', 'audio url', 'mp3', 'file', 'file url', 'url', 'link', 'stream url', 'track url', 'audio file', 'audio_link', 'song url', 'media', 'media url', 'audio link'] },
  { key: 'duration', label: 'Duration', group: 'track', aliases: ['duration', 'length', 'dur', 'time'] },
  { key: 'genre', label: 'Track Genre', group: 'track', aliases: ['genre', 'track genre', 'track_genre'] },
  { key: 'genre_ar', label: 'Track Genre (AR)', group: 'track', aliases: ['genre_ar', 'arabic genre', 'genre (arabic)'] },
  { key: 'language', label: 'Language', group: 'track', aliases: ['language', 'lang'] },
  { key: 'plays', label: 'Plays', group: 'track', aliases: ['plays', 'play count', 'play_count', 'playcount'] },
  { key: 'composer', label: 'Composer', group: 'track', aliases: ['composer', 'music', 'music by', 'composed by'] },
  { key: 'lyricist', label: 'Lyricist', group: 'track', aliases: ['lyricist', 'lyrics', 'lyrics by', 'writer', 'lyricist name'] },
  { key: 'label', label: 'Label', group: 'track', aliases: ['label', 'record label', 'record_label'] },
  { key: 'release_year', label: 'Release Year', group: 'track', aliases: ['release_year', 'year', 'release year', 'released', 'release date'] },
  { key: 'maqam_genre', label: 'Maqam', group: 'track', aliases: ['maqam_genre', 'maqam', 'maqam genre'] },
  { key: 'playlist', label: 'Playlist(s)', group: 'track', aliases: ['playlist', 'playlists', 'playlist name', 'playlist_name'] },
  { key: 'playlist_ar', label: 'Playlist(s) (AR)', group: 'track', aliases: ['playlist_ar', 'arabic playlist', 'playlist (arabic)'] },
  { key: 'upc', label: 'Album UPC', group: 'album', aliases: ['upc'] },
  { key: 'album', label: 'Album Title', group: 'album', aliases: ['album', 'album_title', 'album title', 'album name', 'album_name'] },
  { key: 'album_ar', label: 'Album Title (AR)', group: 'album', aliases: ['album_ar', 'arabic album', 'album (arabic)', 'album_title_ar'] },
  { key: 'album_artist', label: 'Album Artist', group: 'album', aliases: ['album_artist', 'album artist', 'album artist name'] },
  { key: 'album_artist_ar', label: 'Album Artist (AR)', group: 'album', aliases: ['album_artist_ar', 'arabic album artist'] },
  { key: 'album_cover', label: 'Album Cover URL', group: 'album', aliases: ['album_cover', 'album cover', 'album cover url', 'album artwork', 'album image', 'album_cover_url', 'album art', 'album_cover_image'] },
  { key: 'album_release_year', label: 'Album Release Year', group: 'album', aliases: ['album_release_year', 'album year', 'album release year'] },
  { key: 'album_genre', label: 'Album Genre', group: 'album', aliases: ['album_genre', 'album genre'] },
];

const NUMERIC_TRACK = new Set(['duration', 'plays', 'release_year']);

function normalizeHeader(h) {
  return String(h || '').trim().toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '').replace(/__/g, '_');
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else { field += c; }
    } else if (c === '"') { inQuotes = true; }
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') { field += c; }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length && r.some((c) => String(c).trim() !== ''));
}

function toNumber(v) {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parsePlaylists(v) {
  return String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
}

function downloadTemplate() {
  const headers = ['isrc', 'title', 'artist', 'cover_url', 'audio_url', 'genre', 'playlist', 'upc', 'album', 'album_artist', 'album_cover'];
  const sample = ['USRC12345678', 'Sample Track', 'Sample Artist', 'https://example.com/cover.jpg', 'https://example.com/audio.mp3', 'yemeni', 'Children Songs, Arabic Songs', '0123456789012', 'Sample Album', 'Sample Artist', 'https://example.com/album.jpg'];
  const csv = [headers.join(','), sample.join(',')].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bulk-upload-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function autoMap(headers) {
  const norm = headers.map(normalizeHeader);
  const map = {};
  const used = new Set();
  // Required fields first, then the rest, so critical columns don't get grabbed by weak aliases
  const ordered = [...TARGETS].sort((a, b) => (b.required ? 1 : 0) - (a.required ? 1 : 0));
  ordered.forEach((t) => {
    let found = null;
    for (const alias of t.aliases) {
      const a = normalizeHeader(alias);
      for (let i = 0; i < norm.length; i++) {
        if (used.has(i)) continue;
        if (norm[i] === a) { found = i; break; }
      }
      if (found != null) break;
    }
    if (found != null) { map[t.key] = found; used.add(found); }
    else map[t.key] = null;
  });
  return map;
}

export default function BulkUpload({ open, onOpenChange, onDone }) {
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [stage, setStage] = useState('select');
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [updateExisting, setUpdateExisting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const reset = () => {
    setStage('select');
    setHeaders([]);
    setRows([]);
    setMapping({});
    setResult(null);
    setError('');
    setUpdateExisting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = String(ev.target.result || '');
        const parsed = parseCSV(text);
        if (!parsed.length) { setError('The CSV file is empty or could not be parsed.'); setStage('select'); return; }
        const hdrs = parsed[0].map((h) => String(h).trim());
        const dataRows = parsed.slice(1);
        setHeaders(hdrs);
        setRows(dataRows);
        setMapping(autoMap(hdrs));
        setStage('map');
      } catch (err) {
        setError(err.message || 'Failed to read the file.');
        setStage('select');
      }
    };
    reader.readAsText(file);
  };

  const get = (row, key) => {
    const idx = mapping[key];
    if (idx == null) return '';
    return String(row[idx] ?? '').trim();
  };

  const missingRequired = TARGETS.filter((t) => t.required && mapping[t.key] == null);

  const previewRows = useMemo(() => rows.slice(0, 5), [rows]);
  const previewCols = ['isrc', 'title', 'artist', 'cover_url', 'album', 'upc'];

  const process = async () => {
    if (missingRequired.length) {
      toast({
        title: 'Required columns missing',
        description: missingRequired.map((t) => t.label).join(', '),
        variant: 'destructive',
      });
      return;
    }
    setStage('processing');
    try {
      const [existingTracks, existingAlbums] = await Promise.all([
        base44.entities.Track.list('-created_date', 5000),
        base44.entities.Album.list('-created_date', 5000),
      ]);
      const trackByIsrc = new Map();
      existingTracks.forEach((t) => { const k = String(t.isrc || '').trim(); if (k) trackByIsrc.set(k, t); });
      const albumByUpc = new Map();
      existingAlbums.forEach((a) => { const k = String(a.upc || '').trim(); if (k) albumByUpc.set(k, a); });

      const newTracks = [];
      const trackUpdates = [];
      const newTrackPlaylists = [];
      const updateTrackPlaylists = [];
      const newAlbums = [];
      const albumUpdates = [];
      const batchIsrcs = new Set();
      const batchUpcs = new Set();
      let dupTracks = 0;
      let invalidTracks = 0;
      let existingAlbumCount = 0;

      rows.forEach((row) => {
        const isrc = get(row, 'isrc');
        const upc = get(row, 'upc');

        // Album handling (dedup by UPC)
        if (upc) {
          const existing = albumByUpc.get(upc);
          const inBatch = batchUpcs.has(upc);
          if (existing || inBatch) {
            existingAlbumCount++;
            if (updateExisting && existing) {
              albumUpdates.push({
                id: existing.id,
                title: get(row, 'album') || existing.title,
                title_ar: get(row, 'album_ar') || existing.title_ar,
                upc,
                artist: get(row, 'album_artist') || get(row, 'artist') || existing.artist,
                artist_ar: get(row, 'album_artist_ar') || get(row, 'artist_ar') || existing.artist_ar,
                cover_url: get(row, 'album_cover') || get(row, 'cover_url') || existing.cover_url,
                release_year: toNumber(get(row, 'album_release_year')) ?? toNumber(get(row, 'release_year')) ?? existing.release_year,
                genre: get(row, 'album_genre') || get(row, 'genre') || existing.genre,
              });
            }
          } else {
            batchUpcs.add(upc);
            newAlbums.push({
              title: get(row, 'album') || get(row, 'title'),
              title_ar: get(row, 'album_ar'),
              upc,
              artist: get(row, 'album_artist') || get(row, 'artist'),
              artist_ar: get(row, 'album_artist_ar') || get(row, 'artist_ar'),
              cover_url: get(row, 'album_cover') || get(row, 'cover_url'),
              release_year: toNumber(get(row, 'album_release_year')) ?? toNumber(get(row, 'release_year')),
              genre: get(row, 'album_genre') || get(row, 'genre'),
            });
          }
        }

        // Track handling (dedup by ISRC)
        if (!isrc) { invalidTracks++; return; }
        const existing = trackByIsrc.get(isrc);
        const inBatch = batchIsrcs.has(isrc);
        const title = get(row, 'title');
        const audioUrl = get(row, 'audio_url');
        const baseTrack = {
          isrc,
          title,
          title_ar: get(row, 'title_ar'),
          artist: get(row, 'artist'),
          artist_ar: get(row, 'artist_ar'),
          album: get(row, 'album'),
          album_ar: get(row, 'album_ar'),
          cover_url: get(row, 'cover_url'),
          audio_url: audioUrl,
          duration: toNumber(get(row, 'duration')) ?? 0,
          genre: get(row, 'genre'),
          genre_ar: get(row, 'genre_ar'),
          language: get(row, 'language') || 'ar',
          plays: toNumber(get(row, 'plays')) ?? 0,
          composer: get(row, 'composer'),
          lyricist: get(row, 'lyricist'),
          label: get(row, 'label'),
          release_year: toNumber(get(row, 'release_year')),
          maqam_genre: get(row, 'maqam_genre'),
          playlist: get(row, 'playlist'),
          playlist_ar: get(row, 'playlist_ar'),
        };
        if (existing || inBatch) {
          dupTracks++;
          if (updateExisting && existing && title && audioUrl) {
            trackUpdates.push({ id: existing.id, ...baseTrack });
            updateTrackPlaylists.push(parsePlaylists(get(row, 'playlist')));
          }
          return;
        }
        if (!title || !audioUrl) { invalidTracks++; return; }
        batchIsrcs.add(isrc);
        newTracks.push(baseTrack);
        newTrackPlaylists.push(parsePlaylists(get(row, 'playlist')));
      });

      if (newAlbums.length) await base44.entities.Album.bulkCreate(newAlbums);
      if (albumUpdates.length) await base44.entities.Album.bulkUpdate(albumUpdates);
      let createdTracks = [];
      if (newTracks.length) createdTracks = await base44.entities.Track.bulkCreate(newTracks);
      if (trackUpdates.length) await base44.entities.Track.bulkUpdate(trackUpdates);

      // Playlist handling: comma-separated names -> separate Playlist entities
      let playlistsCreated = 0;
      let playlistsUpdated = 0;
      const allAssocs = [];
      (createdTracks || []).forEach((t, i) => allAssocs.push({ trackId: t.id, names: newTrackPlaylists[i] || [] }));
      trackUpdates.forEach((t, i) => allAssocs.push({ trackId: t.id, names: updateTrackPlaylists[i] || [] }));
      if (allAssocs.some((a) => a.names.length)) {
        const existingPlaylists = await base44.entities.Playlist.list('-created_date', 5000);
        const playlistByTitle = new Map();
        existingPlaylists.forEach((p) => playlistByTitle.set(String(p.title || '').trim().toLowerCase(), p));
        const toCreate = new Map();
        const updateMap = new Map();
        allAssocs.forEach(({ trackId, names }) => {
          names.forEach((name) => {
            const key = name.toLowerCase();
            if (playlistByTitle.has(key)) {
              const p = playlistByTitle.get(key);
              const existing = Array.isArray(p.track_ids) ? [...p.track_ids] : [];
              const merged = updateMap.get(p.id) || existing;
              if (!merged.includes(trackId)) merged.push(trackId);
              updateMap.set(p.id, merged);
              p.track_ids = merged;
            } else if (toCreate.has(key)) {
              toCreate.get(key).trackIds.add(trackId);
            } else {
              toCreate.set(key, { title: name, trackIds: new Set([trackId]) });
            }
          });
        });
        if (toCreate.size) {
          const newPlaylists = [...toCreate.values()].map(({ title, trackIds }) => ({ title, track_ids: [...trackIds] }));
          await base44.entities.Playlist.bulkCreate(newPlaylists);
          playlistsCreated = newPlaylists.length;
        }
        if (updateMap.size) {
          const updates = [...updateMap].map(([id, track_ids]) => ({ id, track_ids }));
          await base44.entities.Playlist.bulkUpdate(updates);
          playlistsUpdated = updates.length;
        }
      }

      setResult({
        tracksCreated: newTracks.length,
        tracksUpdated: trackUpdates.length,
        tracksDuplicate: dupTracks - trackUpdates.length,
        tracksInvalid: invalidTracks,
        albumsCreated: newAlbums.length,
        albumsUpdated: albumUpdates.length,
        albumsExisting: existingAlbumCount - albumUpdates.length,
        playlistsCreated,
        playlistsUpdated,
      });
      setStage('done');
      onDone?.();
    } catch (e) {
      toast({ title: 'Bulk upload failed', description: e.message, variant: 'destructive' });
      setStage('map');
    }
  };

  const close = () => { reset(); onOpenChange(false); };

  const renderFieldSelect = (t) => {
    const val = mapping[t.key];
    return (
      <div key={t.key} className="flex items-center justify-between gap-3 py-1">
        <Label className="text-sm flex items-center gap-1 shrink-0">
          {t.label}
          {t.required && <span className="text-destructive">*</span>}
        </Label>
        <Select
          value={val == null ? '__none__' : String(val)}
          onValueChange={(v) => setMapping((m) => ({ ...m, [t.key]: v === '__none__' ? null : Number(v) }))}
        >
          <SelectTrigger className="w-48 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">— None —</SelectItem>
            {headers.map((h, i) => (
              <SelectItem key={i} value={String(i)}>{h}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}
    >
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" /> Bulk Upload
          </DialogTitle>
        </DialogHeader>

        {stage === 'select' && (
          <div className="py-2 space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload a CSV to import tracks and albums. Each row is a track identified by a
              unique <strong>ISRC</strong>; tracks are grouped into albums by <strong>UPC</strong>
              (one album per unique UPC, multiple ISRCs under it). You'll map your CSV columns next.
            </p>
            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /><span>{error}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 cursor-pointer">
                <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
                <div className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-8 px-4 hover:border-primary/50 hover:bg-muted/50 transition-colors">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Choose CSV file</span>
                </div>
              </label>
              <Button variant="outline" onClick={downloadTemplate} type="button">
                <Download className="w-4 h-4 me-2" /> Template
              </Button>
            </div>
          </div>
        )}

        {(stage === 'map' || stage === 'processing') && (
          <div className="py-2 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm text-muted-foreground">
                {rows.length} rows detected · {headers.length} columns. Map your columns to fields:
              </div>
              <div className="flex items-center gap-2">
                <Switch id="upd" checked={updateExisting} onCheckedChange={setUpdateExisting} disabled={stage === 'processing'} />
                <Label htmlFor="upd" className="text-sm">Update existing (by ISRC/UPC)</Label>
              </div>
            </div>

            {missingRequired.length > 0 && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Required: {missingRequired.map((t) => t.label).join(', ')}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Track</div>
                {TARGETS.filter((t) => t.group === 'track').map(renderFieldSelect)}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground mb-1">Album</div>
                {TARGETS.filter((t) => t.group === 'album').map(renderFieldSelect)}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Preview (first 5 rows)</div>
              <div className="border border-border rounded-lg overflow-x-auto max-h-56 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {previewCols.map((c) => (
                        <TableHead key={c}>{TARGETS.find((t) => t.key === c)?.label || c}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((r, i) => (
                      <TableRow key={i}>
                        {previewCols.map((c) => (
                          <TableCell key={c} className="max-w-[180px] truncate">{get(r, c) || '—'}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}

        {stage === 'processing' && (
          <div className="py-12 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Importing and checking for duplicates…</p>
          </div>
        )}

        {stage === 'done' && result && (
          <div className="py-2 space-y-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
              <CheckCircle2 className="w-5 h-5" /><span className="font-medium">Import complete</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">{result.tracksCreated}</div>
                <div className="text-xs text-muted-foreground">Tracks created</div>
              </div>
              {updateExisting && (
                <div className="rounded-lg border border-border p-3">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">{result.tracksUpdated}</div>
                  <div className="text-xs text-muted-foreground">Tracks updated</div>
                </div>
              )}
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold">{result.tracksDuplicate}</div>
                <div className="text-xs text-muted-foreground">Duplicate tracks skipped</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">{result.albumsCreated}</div>
                <div className="text-xs text-muted-foreground">Albums created</div>
              </div>
              {updateExisting && (
                <div className="rounded-lg border border-border p-3">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">{result.albumsUpdated}</div>
                  <div className="text-xs text-muted-foreground">Albums updated</div>
                </div>
              )}
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold">{result.albumsExisting}</div>
                <div className="text-xs text-muted-foreground">Existing albums matched</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">{result.playlistsCreated}</div>
                <div className="text-xs text-muted-foreground">Playlists created</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">{result.playlistsUpdated}</div>
                <div className="text-xs text-muted-foreground">Playlists updated</div>
              </div>
            </div>
            {result.tracksInvalid > 0 && (
              <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500 bg-amber-500/10 rounded-md p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{result.tracksInvalid} row(s) skipped — missing ISRC, title, or audio URL.</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {stage === 'map' && (
            <>
              <Button variant="outline" onClick={reset}>Choose another</Button>
              <Button onClick={process} disabled={missingRequired.length > 0}>
                <Upload className="w-4 h-4 me-2" /> Process & Import
              </Button>
            </>
          )}
          {stage === 'done' && <Button onClick={close}>Done</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}