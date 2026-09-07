import React, { useState, useRef } from 'react';
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

const TEMPLATE_HEADERS = [
  'isrc', 'title', 'title_ar', 'artist', 'artist_ar', 'audio_url', 'cover_url',
  'duration', 'genre', 'genre_ar', 'language', 'plays', 'composer', 'lyricist',
  'label', 'release_year', 'maqam_genre',
  'upc', 'album', 'album_ar', 'album_artist', 'album_artist_ar', 'album_cover',
  'album_release_year', 'album_genre',
];

const NUMERIC_TRACK = ['duration', 'plays', 'release_year'];
const NUMERIC_ALBUM = ['album_release_year'];

function normalizeHeader(h) {
  return String(h || '').trim().toLowerCase().replace(/\s+/g, '_');
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
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length && r.some((c) => String(c).trim() !== ''));
}

function toNumber(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function downloadTemplate() {
  const sample = ['USRC12345678', 'Sample Track', 'عينة', 'Sample Artist', 'فنان عينة', 'https://example.com/audio.mp3', 'https://example.com/cover.jpg', '210', 'pop', 'بوب', 'en', '0', 'Composer', 'Lyricist', 'Label', '2024', '', '0123456789012', 'Sample Album', 'ألبوم عينة', 'Sample Artist', 'فنان عينة', 'https://example.com/album.jpg', '2024', 'pop'];
  const csv = [TEMPLATE_HEADERS.join(','), sample.join(',')].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bulk-upload-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function BulkUpload({ open, onOpenChange, onDone }) {
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [stage, setStage] = useState('select'); // select | preview | processing | done
  const [parsed, setParsed] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const reset = () => {
    setStage('select');
    setParsed(null);
    setResult(null);
    setError('');
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
        const rows = parseCSV(text);
        if (!rows.length) {
          setError('The CSV file is empty or could not be parsed.');
          setStage('select');
          return;
        }
        const headers = rows[0].map(normalizeHeader);
        const colIndex = {};
        headers.forEach((h, i) => {
          if (!(h in colIndex)) colIndex[h] = i;
        });
        const dataRows = rows.slice(1);
        const hasIsrc = 'isrc' in colIndex;
        const hasUpc = 'upc' in colIndex;
        setParsed({ headers, colIndex, rows: dataRows, hasIsrc, hasUpc });
        setStage('preview');
      } catch (err) {
        setError(err.message || 'Failed to read the file.');
        setStage('select');
      }
    };
    reader.readAsText(file);
  };

  const get = (row, key) => {
    const idx = parsed.colIndex[key];
    return idx != null ? String(row[idx] ?? '').trim() : '';
  };

  const process = async () => {
    if (!parsed) return;
    if (!parsed.hasIsrc) {
      toast({ title: 'Missing ISRC column', description: 'An "isrc" column is required.', variant: 'destructive' });
      return;
    }
    setStage('processing');
    try {
      // Fetch existing records for duplicate detection
      const [existingTracks, existingAlbums] = await Promise.all([
        base44.entities.Track.list('-created_date', 5000),
        base44.entities.Album.list('-created_date', 5000),
      ]);
      const existingIsrcs = new Set(
        existingTracks.map((t) => String(t.isrc || '').trim()).filter(Boolean)
      );
      const existingUpcs = new Set(
        existingAlbums.map((a) => String(a.upc || '').trim()).filter(Boolean)
      );

      const batchIsrcs = new Set();
      const batchUpcs = new Set();
      const newTracks = [];
      const newAlbums = [];
      let dupTracks = 0;
      let invalidTracks = 0;
      let existingAlbumCount = 0;

      parsed.rows.forEach((row) => {
        const isrc = get(row, 'isrc');
        const upc = get(row, 'upc');

        // Album handling (dedup by UPC)
        if (parsed.hasUpc && upc) {
          if (existingUpcs.has(upc) || batchUpcs.has(upc)) {
            existingAlbumCount++;
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
        if (!isrc) {
          invalidTracks++;
          return;
        }
        if (existingIsrcs.has(isrc) || batchIsrcs.has(isrc)) {
          dupTracks++;
          return;
        }
        batchIsrcs.add(isrc);
        const title = get(row, 'title');
        const audioUrl = get(row, 'audio_url');
        if (!title || !audioUrl) {
          invalidTracks++;
          return;
        }
        const track = {
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
        };
        newTracks.push(track);
      });

      // Create albums first, then tracks
      if (newAlbums.length) {
        await base44.entities.Album.bulkCreate(newAlbums);
      }
      if (newTracks.length) {
        await base44.entities.Track.bulkCreate(newTracks);
      }

      setResult({
        tracksCreated: newTracks.length,
        tracksDuplicate: dupTracks,
        tracksInvalid: invalidTracks,
        albumsCreated: newAlbums.length,
        albumsExisting: existingAlbumCount,
      });
      setStage('done');
      onDone?.();
    } catch (e) {
      toast({ title: 'Bulk upload failed', description: e.message, variant: 'destructive' });
      setStage('preview');
    }
  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" /> Bulk Upload
          </DialogTitle>
        </DialogHeader>

        {stage === 'select' && (
          <div className="py-2 space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload a CSV file to import tracks and albums. Each row is a track identified by a
              unique <strong>ISRC</strong>. Tracks are grouped into albums by <strong>UPC</strong> —
              one album per unique UPC, with multiple ISRCs allowed under the same UPC. Duplicates
              (existing ISRC or UPC) are skipped automatically.
            </p>
            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFile}
                />
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

        {stage === 'preview' && parsed && (
          <div className="py-2 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold">{parsed.rows.length}</div>
                <div className="text-xs text-muted-foreground">Rows found</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold">{parsed.hasIsrc ? 'Yes' : 'No'}</div>
                <div className="text-xs text-muted-foreground">ISRC column</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold">{parsed.hasUpc ? 'Yes' : 'No'}</div>
                <div className="text-xs text-muted-foreground">UPC column</div>
              </div>
            </div>
            {!parsed.hasIsrc && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-md p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>An "isrc" column is required to import tracks.</span>
              </div>
            )}
            <div>
              <div className="text-sm font-medium mb-2">Preview (first 5 rows)</div>
              <div className="border border-border rounded-lg overflow-x-auto max-h-60 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {parsed.headers.slice(0, 6).map((h, i) => (
                        <TableHead key={i}>{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsed.rows.slice(0, 5).map((r, i) => (
                      <TableRow key={i}>
                        {parsed.headers.slice(0, 6).map((h, j) => (
                          <TableCell key={j} className="max-w-[160px] truncate">
                            {String(r[j] ?? '')}
                          </TableCell>
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
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Import complete</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">{result.tracksCreated}</div>
                <div className="text-xs text-muted-foreground">Tracks created</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold">{result.tracksDuplicate}</div>
                <div className="text-xs text-muted-foreground">Duplicate tracks skipped</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">{result.albumsCreated}</div>
                <div className="text-xs text-muted-foreground">Albums created</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-2xl font-bold">{result.albumsExisting}</div>
                <div className="text-xs text-muted-foreground">Existing albums matched</div>
              </div>
            </div>
            {result.tracksInvalid > 0 && (
              <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500 bg-amber-500/10 rounded-md p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{result.tracksInvalid} row(s) skipped — missing ISRC, title, or audio_url.</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {stage === 'preview' && (
            <>
              <Button variant="outline" onClick={reset} disabled={stage === 'processing'}>
                Choose another
              </Button>
              <Button onClick={process} disabled={!parsed.hasIsrc}>
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