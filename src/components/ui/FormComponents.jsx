export function FormField({ label, error, required, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
        {label}
        {required && <span className="text-[#4A3A5C] ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-[#4A3A5C]">{error}</p>}
    </div>
  )
}

export function TextInput({
  placeholder,
  value,
  onChange,
  error,
  type = 'text',
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 bg-white border rounded-lg text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C] focus:border-transparent transition ${
        error ? 'border-[#4A3A5C]' : 'border-[#E5E5E5]'
      }`}
      {...props}
    />
  )
}

export function TextArea({
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  ...props
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-2.5 bg-white border rounded-lg text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C] focus:border-transparent transition resize-none ${
        error ? 'border-[#4A3A5C]' : 'border-[#E5E5E5]'
      }`}
      {...props}
    />
  )
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  ...props
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2.5 bg-white border rounded-lg text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#4A3A5C] focus:border-transparent transition ${
        error ? 'border-[#4A3A5C]' : 'border-[#E5E5E5]'
      }`}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}) {
  const variants = {
    primary: 'bg-[#4A3A5C] text-white hover:bg-[#3D3149]',
    secondary: 'bg-[#F3F1F7] text-[#1A1A1A] hover:bg-[#E8E3F0] border border-[#E5E5E5]',
    danger: 'bg-[#4A3A5C] text-white hover:bg-[#3D3149]',
    ghost: 'bg-transparent text-[#666666] hover:bg-[#F3F1F7] border border-[#E5E5E5]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      disabled={disabled || loading}
      className={`font-medium rounded-lg transition flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}

export function Checkbox({ label, checked, onChange, ...props }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 bg-white border border-[#E5E5E5] rounded cursor-pointer accent-[#4A3A5C]"
        {...props}
      />
      <span className="text-sm text-[#1A1A1A]">{label}</span>
    </label>
  )
}
