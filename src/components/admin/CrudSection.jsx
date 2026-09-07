import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Pencil, Trash2, Search } from 'lucide-react';
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

function buildEmpty(fields) {
  const obj = {};
  fields.forEach((f) => {
    if (f.type === 'array') obj[f.key] = '';
    else if (f.type === 'number') obj[f.key] = '';
    else obj[f.key] = '';
  });
  return obj;
}

export default function CrudSection({ entityName, title, fields, columns, searchKeys }) {
  const { toast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(buildEmpty(fields));
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await base44.entities[entityName].list('-created_date', 200);
      setRecords(data);
    } catch (e) {
      toast({ title: 'Failed to load', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [entityName]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(buildEmpty(fields));
    setDialogOpen(true);
  };

  const openEdit = (rec) => {
    setEditing(rec);
    const f = {};
    fields.forEach((fd) => {
      if (fd.type === 'array') {
        f[fd.key] = Array.isArray(rec[fd.key]) ? rec[fd.key].join(', ') : '';
      } else {
        f[fd.key] = rec[fd.key] ?? '';
      }
    });
    setForm(f);
    setDialogOpen(true);
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    for (const f of fields) {
      if (f.required && !String(form[f.key] ?? '').trim()) {
        toast({ title: `${f.label} is required`, variant: 'destructive' });
        return;
      }
    }
    setSaving(true);
    try {
      const payload = { ...form };
      fields.forEach((fd) => {
        if (fd.type === 'number') {
          const v = payload[fd.key];
          payload[fd.key] = v === '' || v === null ? null : Number(v);
        } else if (fd.type === 'array') {
          payload[fd.key] = String(payload[fd.key] || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      });
      if (editing) {
        await base44.entities[entityName].update(editing.id, payload);
        toast({ title: `${title} updated` });
      } else {
        await base44.entities[entityName].create(payload);
        toast({ title: `${title} created` });
      }
      setDialogOpen(false);
      load();
    } catch (e) {
      toast({ title: 'Save failed', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (rec) => {
    const label = rec[columns[0].key] || 'this record';
    if (!window.confirm(`Delete "${label}"?`)) return;
    try {
      await base44.entities[entityName].delete(rec.id);
      toast({ title: `${title} deleted` });
      load();
    } catch (e) {
      toast({ title: 'Delete failed', description: e.message, variant: 'destructive' });
    }
  };

  const filtered = query
    ? records.filter((r) =>
        searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(query.toLowerCase()))
      )
    : records;

  const renderField = (f) => {
    const value = form[f.key];
    switch (f.type) {
      case 'textarea':
        return (
          <Textarea value={value} onChange={(e) => setField(f.key, e.target.value)} rows={3} />
        );
      case 'select':
        return (
          <Select value={value || ''} onValueChange={(v) => setField(f.key, v)}>
            <SelectTrigger>
              <SelectValue placeholder={f.placeholder || 'Select'} />
            </SelectTrigger>
            <SelectContent>
              {f.options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setField(f.key, e.target.value)}
          />
        );
      default:
        return (
          <Input
            type={f.type === 'url' ? 'url' : 'text'}
            value={value}
            onChange={(e) => setField(f.key, e.target.value)}
          />
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="ps-9"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 me-2" /> Add {title}
        </Button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No records found.</div>
      ) : (
        <div className="border border-border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={c.key}>{c.label}</TableHead>
                ))}
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rec) => (
                <TableRow key={rec.id}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className="max-w-[220px] truncate">
                      {c.render ? c.render(rec) : String(rec[c.key] ?? '')}
                    </TableCell>
                  ))}
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(rec)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(rec)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {fields.map((f) => (
              <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                <Label className="mb-1.5 block">
                  {f.label}
                  {f.required ? ' *' : ''}
                </Label>
                {renderField(f)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 me-2 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}