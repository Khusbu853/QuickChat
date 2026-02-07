import React, { useState, useEffect, useRef } from "react";

/* ---------------- Debounce Hook ---------------- */

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/* ---------------- Helpers ---------------- */

function groupOptions(options, groupBy) {
  if (!groupBy) return { "": options };

  return options.reduce((acc, option) => {
    const key = option[groupBy] || "";
    if (!acc[key]) acc[key] = [];
    acc[key].push(option);
    return acc;
  }, {});
}

function removeSelected(groupedOptions, selected) {
  const result = {};

  Object.entries(groupedOptions).forEach(([key, arr]) => {
    result[key] = arr.filter(
      (opt) => !selected.some((s) => s.value === opt.value)
    );
  });

  return result;
}

/* ---------------- Main Component ---------------- */

export default function MultipleSelector({
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
  groupBy,
  creatable = false,
  maxSelected = Infinity,
  onSearch,
  delay = 400,
}) {
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const [selected, setSelected] = useState(value);
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [internalOptions, setInternalOptions] = useState(
    groupOptions(options, groupBy)
  );
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(inputValue, delay);

  /* ---------------- Sync external value ---------------- */

  useEffect(() => {
    setSelected(value || []);
  }, [value]);

  /* ---------------- Sync options ---------------- */

  useEffect(() => {
    if (!onSearch) {
      setInternalOptions(groupOptions(options, groupBy));
    }
  }, [options, groupBy, onSearch]);

  /* ---------------- Async Search ---------------- */

  useEffect(() => {
    if (!onSearch || !dropdownOpen) return;

    const runSearch = async () => {
      setLoading(true);
      const res = await onSearch(debouncedSearch);
      setInternalOptions(groupOptions(res || [], groupBy));
      setLoading(false);
    };

    runSearch();
  }, [debouncedSearch, dropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  /* ---------------- Handlers ---------------- */

  const removeItem = (item) => {
    const updated = selected.filter((s) => s.value !== item.value);
    setSelected(updated);
    onChange?.(updated);
  };

  const addItem = (item) => {
    if (selected.length >= maxSelected) return;

    const updated = [...selected, item];
    setSelected(updated);
    onChange?.(updated);
    setInputValue("");
  };

  const clearAll = () => {
    setSelected([]);
    onChange?.([]);
  };

  /* ---------------- Filtered Options ---------------- */

  const selectable = removeSelected(internalOptions, selected);

  /* ---------------- Creatable ---------------- */

  const showCreate =
    creatable &&
    inputValue &&
    !selected.some((s) => s.value === inputValue);

  /* ---------------- Keyboard Support ---------------- */

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && !inputValue && selected.length > 0) {
      removeItem(selected[selected.length - 1]);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", position: "relative" }}
    >
      {/* Selected Chips + Input */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "6px",
          borderRadius: "6px",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {selected.map((item) => (
          <div
            key={item.value}
            style={{
              background: "#6b46c1",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {item.label}
            <span
              style={{ cursor: "pointer" }}
              onClick={() => removeItem(item)}
            >
              ✕
            </span>
          </div>
        ))}

        <input
          ref={inputRef}
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            minWidth: "80px",
          }}
        />
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div
          style={{
            border: "1px solid #ccc",
            marginTop: "4px",
            borderRadius: "6px",
            background: "white",
            color: "black",
            maxHeight: "200px",
            overflow: "auto",
            position: "absolute",
            width: "100%",
            zIndex: 1000,
          }}
        >
          {loading && <div style={{ padding: 8 }}>Loading...</div>}

          {!loading &&
            Object.entries(selectable).map(([group, items]) => (
              <div key={group}>
                {group && (
                  <div
                    style={{
                      fontWeight: "bold",
                      padding: "6px",
                      background: "#f5f5f5",
                    }}
                  >
                    {group}
                  </div>
                )}

                {items
                  .filter((opt) =>
                    opt.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  )
                  .map((opt) => (
                    <div
                      key={opt.value}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                      }}
                      onMouseDown={() => addItem(opt)}
                    >
                      {opt.label}
                    </div>
                  ))}
              </div>
            ))}

          {showCreate && (
            <div
              style={{ padding: "8px", cursor: "pointer" }}
              onMouseDown={() =>
                addItem({ value: inputValue, label: inputValue })
              }
            >
              Create "{inputValue}"
            </div>
          )}

          {!loading &&
            Object.values(selectable).every((arr) => arr.length === 0) &&
            !showCreate && (
              <div style={{ padding: 8 }}>No results found</div>
            )}
        </div>
      )}

      {/* Clear Button */}
      {selected.length > 0 && (
        <button
          onClick={clearAll}
          style={{ marginTop: "6px", cursor: "pointer" }}
        >
          Clear All
        </button>
      )}
    </div>
  );
}
