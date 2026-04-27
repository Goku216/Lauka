"use client";
import { getSiteConfiguration, updateSiteConfiguration } from "@/service/api";
import { useState, useCallback, useEffect, ChangeEvent, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormErrors = Partial<Record<keyof FormValues, string>>;
type TouchedFields = Partial<Record<keyof FormValues, boolean>>;

export interface ConfigRecord {
  site_name: string;
  phone_number: string;
  email: string;
  full_address: string;
  delivery_area: string;
  opening_time: string;
  happy_customers: string;
  fresh_products: string;
  organic_percentage: string;
  cash_on_delivery: boolean;
  short_description: string;
  facebook: string;
  instagram: string;
  twitter: string;
  logo: string; // URL string from API; file upload replaces it
}

type FormValues = Omit<ConfigRecord, "id" | "created_at">;

interface ToastState {
  visible: boolean;
  message: string;
  isError: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPTY_FORM: FormValues = {
  site_name: "", phone_number: "", email: "", full_address: "",
  delivery_area: "", opening_time: "", happy_customers: "",
  fresh_products: "", organic_percentage: "", cash_on_delivery: false,
  short_description: "", facebook: "", instagram: "", twitter: "", logo: "",
};

/** Fetches current site config. Replace URL with your real endpoint. */
async function fetchConfig(): Promise<Partial<FormValues>> {
  const res = await getSiteConfiguration();  // 🔁 Replace with your endpoint
 
    return res;
}

/** Submits config as FormData. Replace URL with your real endpoint. */
async function saveConfig(formData: FormData): Promise<void> {
  const res = await fetch("/api/config", {  // 🔁 Replace with your endpoint
    method: "POST",
    body: formData,
    // Do NOT set Content-Type; browser sets it with boundary automatically
  });
  if (!res.ok) throw new Error("Failed to save config");
}

// ─── Small components ─────────────────────────────────────────────────────────

function Toast({ message, visible, isError }: ToastState) {
  return (
    <div
      className={`fixed bottom-6 right-6 text-white text-xs px-4 py-2.5 rounded-lg pointer-events-none transition-opacity duration-300 z-50
        ${visible ? "opacity-100" : "opacity-0"}
        ${isError ? "bg-red-700" : "bg-green-700"}`}
    >
      {message}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`w-9 h-5 rounded-full relative cursor-pointer shrink-0 transition-colors duration-200
        ${value ? "bg-green-600" : "bg-gray-300"}`}
    >
      <div
        className={`absolute w-3.5 h-3.5 bg-white rounded-full top-[3px] shadow transition-all duration-200
          ${value ? "left-[19px]" : "left-[3px]"}`}
      />
    </div>
  );
}

function FormField({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 ${full ? "md:col-span-2" : ""}`}>
      {label && (
        <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-2 mb-1 md:col-span-2">
      {children}
    </p>
  );
}

const inputClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900";

// ─── ConfigForm ───────────────────────────────────────────────────────────────

interface ConfigFormProps {
  initialValues: Partial<FormValues>;
  onSave: (formData: FormData, plainValues: FormValues) => Promise<void>;
}

function ConfigForm({ initialValues, onSave }: ConfigFormProps) {
  const [form, setForm] = useState<FormValues>({ ...EMPTY_FORM, ...initialValues });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  // logoPreview: shows either the uploaded file preview or the URL from API
  const [logoPreview, setLogoPreview] = useState<string>(initialValues.logo ?? "");
  const [saving, setSaving] = useState(false);

  // Sync when initialValues change (e.g. after API fetch)
  useEffect(() => {
    setForm(f => ({ ...f, ...initialValues }));
    if (initialValues.logo) setLogoPreview(initialValues.logo);
  }, [initialValues]);

  const set = <K extends keyof FormValues>(key: K, val: FormValues[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2MB"); return; }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview((ev.target?.result as string) ?? "");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    const textFields: Array<keyof Omit<FormValues, "cash_on_delivery" | "logo">> = [
      "site_name", "phone_number", "email", "full_address", "delivery_area",
      "opening_time", "happy_customers", "fresh_products", "organic_percentage",
      "short_description", "facebook", "instagram", "twitter",
    ];

    textFields.forEach(key => formData.append(key, String(form[key])));
    formData.append("cash_on_delivery", String(form.cash_on_delivery));

    if (logoFile) {
      // New file selected — send the file
      formData.append("logo", logoFile, logoFile.name);
    } else if (form.logo) {
      // No new file — send existing URL so the server knows to keep it
      formData.append("logo_url", form.logo);
    }

    // 📋 Console log all entries for debugging
    const logObj: Record<string, unknown> = {};
    for (const [key, val] of formData.entries()) {
      logObj[key] = val instanceof File
        ? { name: val.name, size: val.size, type: val.type }
        : val;
    }
    console.log("📤 FormData being submitted:", logObj);
    console.log("📋 Plain form values:", form);

    setSaving(true);
    try {
      await onSave(formData, form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <SectionTitle>Basic Info</SectionTitle>

        <FormField label="Site name">
          <input className={inputClass} value={form.site_name} onChange={e => set("site_name", e.target.value)} placeholder="My Organic Store" />
        </FormField>
        <FormField label="Phone number">
          <input className={inputClass} value={form.phone_number} onChange={e => set("phone_number", e.target.value)} placeholder="+977 98XXXXXXXX" />
        </FormField>
        <FormField label="Email">
          <input className={inputClass} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="hello@store.com" />
        </FormField>
        <FormField label="Full address">
          <input className={inputClass} value={form.full_address} onChange={e => set("full_address", e.target.value)} placeholder="123 Green St, Kathmandu" />
        </FormField>
        <FormField label="Delivery area">
          <input className={inputClass} value={form.delivery_area} onChange={e => set("delivery_area", e.target.value)} placeholder="Kathmandu Valley" />
        </FormField>
        <FormField label="Opening time">
          <input className={inputClass} value={form.opening_time} onChange={e => set("opening_time", e.target.value)} placeholder="Mon–Sat 8am–8pm" />
        </FormField>

        <SectionTitle>Stats</SectionTitle>

        <FormField label="Happy customers">
          <input className={inputClass} type="number" value={form.happy_customers} onChange={e => set("happy_customers", e.target.value)} placeholder="1200" />
        </FormField>
        <FormField label="Fresh products">
          <input className={inputClass} type="number" value={form.fresh_products} onChange={e => set("fresh_products", e.target.value)} placeholder="340" />
        </FormField>
        <FormField label="Organic percentage">
          <input className={inputClass} type="number" min={0} max={100} value={form.organic_percentage} onChange={e => set("organic_percentage", e.target.value)} placeholder="95" />
        </FormField>

        <SectionTitle>Settings</SectionTitle>

        <div
          className="md:col-span-2 flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer select-none"
          onClick={() => set("cash_on_delivery", !form.cash_on_delivery)}
        >
          <span className="flex-1 text-sm text-gray-800">Cash on delivery</span>
          <Toggle value={form.cash_on_delivery} onChange={v => set("cash_on_delivery", v)} />
        </div>

        <SectionTitle>Content</SectionTitle>

        <FormField label="Short description" full>
          <textarea
            className={`${inputClass} resize-y min-h-20`}
            value={form.short_description}
            onChange={e => set("short_description", e.target.value)}
            placeholder="We deliver fresh, organic produce to your doorstep..."
            rows={3}
          />
        </FormField>

        <SectionTitle>Social Media</SectionTitle>

        <FormField label="Facebook">
          <input className={inputClass} value={form.facebook} onChange={e => set("facebook", e.target.value)} placeholder="https://facebook.com/yourpage" />
        </FormField>
        <FormField label="Instagram">
          <input className={inputClass} value={form.instagram} onChange={e => set("instagram", e.target.value)} placeholder="https://instagram.com/yourhandle" />
        </FormField>
        <FormField label="Twitter / X" full>
          <input className={inputClass} value={form.twitter} onChange={e => set("twitter", e.target.value)} placeholder="https://twitter.com/yourhandle" />
        </FormField>

        <SectionTitle>Logo</SectionTitle>

        <label className="md:col-span-2 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer block relative hover:border-green-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          />
          {logoPreview && (
            <div className="flex justify-center mb-3">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
            </div>
          )}
          <p className="text-sm font-semibold text-blue-600">
            {logoPreview ? "Change logo" : "Upload logo"}
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG — recommended 200×200px, max 2MB</p>
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-green-700 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors cursor-pointer"
        >
          {saving ? "Saving..." : "Update"}
        </button>
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function CMSModal() {
  const [configValues, setConfigValues] = useState<Partial<FormValues>>({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: "", isError: false });

  const showToast = useCallback((msg: string, isError = false) => {
    setToast({ visible: true, message: msg, isError });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  }, []);

  // Fetch existing config on mount to pre-fill the form
  useEffect(() => {
    fetchConfig()
      .then(data => {
        console.log("📥 Fetched config from API:", data);
        setConfigValues(data);
      })
      .catch(err => {
        console.error("Failed to fetch config:", err);
        showToast("Failed to load config", true);
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleSave = async (formData: FormData, plainValues: FormValues) => {
    if (!plainValues.site_name) {
      showToast("Site name is required", true);
      return;
    }
    try {
      await updateSiteConfiguration(formData);
      showToast("Configuration saved!");
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Failed to save configuration", true);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl w-full font-sans text-gray-900 p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold m-0">Site Configuration</h2>
          {loading && (
            <span className="text-xs text-gray-400 animate-pulse">Loading...</span>
          )}
        </div>

        {!loading && (
          <ConfigForm
            initialValues={configValues}
            onSave={handleSave}
          />
        )}
      </div>

      <Toast message={toast.message} visible={toast.visible} isError={toast.isError} />
    </>
  );
}