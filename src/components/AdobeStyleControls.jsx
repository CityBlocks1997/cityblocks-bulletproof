import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

export default function AdobeStyleControls({ 
  facadeColor, 
  setFacadeColor,
  facadeOpacity,
  setFacadeOpacity,
  facadeImage,
  setFacadeImage,
  facadeImageOpacity,
  setFacadeImageOpacity,
  isUploading,
  onImageUpload 
}) {
  const [blendMode, setBlendMode] = React.useState('normal');
  const [brightness, setBrightness] = React.useState(100);
  const [contrast, setContrast] = React.useState(100);
  const [saturation, setSaturation] = React.useState(100);
  const [hueRotate, setHueRotate] = React.useState(0);
  const [blur, setBlur] = React.useState(0);
  const [gradientType, setGradientType] = React.useState('none');
  const [gradientColor1, setGradientColor1] = React.useState('#d4af37');
  const [gradientColor2, setGradientColor2] = React.useState('#8B5A3C');

  const blendModes = [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 
    'exclusion', 'hue', 'saturation', 'color', 'luminosity'
  ];

  const gradientTypes = [
    { value: 'none', label: 'No Gradient' },
    { value: 'linear', label: 'Linear Gradient' },
    { value: 'radial', label: 'Radial Gradient' },
    { value: 'conic', label: 'Conic Gradient' }
  ];

  const getGradientStyle = () => {
    if (gradientType === 'linear') {
      return `linear-gradient(135deg, ${gradientColor1}, ${gradientColor2})`;
    } else if (gradientType === 'radial') {
      return `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`;
    } else if (gradientType === 'conic') {
      return `conic-gradient(from 0deg, ${gradientColor1}, ${gradientColor2}, ${gradientColor1})`;
    }
    return facadeColor;
  };

  const getFilterStyle = () => {
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) blur(${blur}px)`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      {/* Color & Gradient Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h4 style={{ color: '#d4af37', fontSize: '1.1rem', marginBottom: '15px', fontWeight: 'bold' }}>
          🎨 Color & Gradient
        </h4>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '0.9rem', color: '#4a2c1f', display: 'block', marginBottom: '8px' }}>
            Gradient Type
          </label>
          <Select value={gradientType} onValueChange={setGradientType}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gradientTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {gradientType === 'none' ? (
          <div>
            <label style={{ fontSize: '0.9rem', color: '#4a2c1f', display: 'block', marginBottom: '8px' }}>
              Solid Color
            </label>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <input
                type="color"
                value={facadeColor}
                onChange={(e) => setFacadeColor(e.target.value)}
                style={{ width: '80px', height: '40px', border: '2px solid #4a2c1f', borderRadius: '8px', cursor: 'pointer' }}
              />
              <span style={{ color: '#4a2c1f', fontFamily: 'monospace', fontSize: '1rem' }}>
                {facadeColor}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#4a2c1f', display: 'block', marginBottom: '8px' }}>
                Color 1
              </label>
              <input
                type="color"
                value={gradientColor1}
                onChange={(e) => setGradientColor1(e.target.value)}
                style={{ width: '100%', height: '40px', border: '2px solid #4a2c1f', borderRadius: '8px', cursor: 'pointer' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.9rem', color: '#4a2c1f', display: 'block', marginBottom: '8px' }}>
                Color 2
              </label>
              <input
                type="color"
                value={gradientColor2}
                onChange={(e) => setGradientColor2(e.target.value)}
                style={{ width: '100%', height: '40px', border: '2px solid #4a2c1f', borderRadius: '8px', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}

        <div style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: '#4a2c1f' }}>Opacity</span>
            <span style={{ fontSize: '0.9rem', color: '#4a2c1f', fontWeight: 'bold' }}>{facadeOpacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={facadeOpacity}
            onChange={(e) => setFacadeOpacity(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#d4af37' }}
          />
        </div>
      </div>

      {/* Image Layer Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h4 style={{ color: '#d4af37', fontSize: '1.1rem', marginBottom: '15px', fontWeight: 'bold' }}>
          🖼️ Image Layer
        </h4>
        
        {!facadeImage ? (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) onImageUpload(file);
              }}
              style={{ 
                padding: '12px',
                width: '100%',
                border: '2px dashed #d4af37',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'rgba(212, 175, 55, 0.05)'
              }}
              disabled={isUploading}
            />
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '8px', textAlign: 'center' }}>
              Upload custom background image
            </p>
          </div>
        ) : (
          <div>
            <div style={{ 
              background: 'rgba(74, 222, 128, 0.2)', 
              border: '2px solid #4ade80', 
              padding: '12px', 
              borderRadius: '8px',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '0.9rem' }}>✅ Image uploaded</span>
              <Button
                onClick={() => setFacadeImage(null)}
                variant="outline"
                size="sm"
                style={{ background: '#ef4444', color: 'white', border: 'none' }}
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: '#4a2c1f' }}>Image Opacity</span>
                <span style={{ fontSize: '0.9rem', color: '#4a2c1f', fontWeight: 'bold' }}>{facadeImageOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={facadeImageOpacity}
                onChange={(e) => setFacadeImageOpacity(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#d4af37' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '0.9rem', color: '#4a2c1f', display: 'block', marginBottom: '8px' }}>
                Blend Mode
              </label>
              <Select value={blendMode} onValueChange={setBlendMode}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {blendModes.map(mode => (
                    <SelectItem key={mode} value={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h4 style={{ color: '#d4af37', fontSize: '1.1rem', marginBottom: '15px', fontWeight: 'bold' }}>
          ✨ Creative Filters
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#4a2c1f' }}>Brightness</span>
              <span style={{ fontSize: '0.85rem', color: '#4a2c1f', fontWeight: 'bold' }}>{brightness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#d4af37' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#4a2c1f' }}>Contrast</span>
              <span style={{ fontSize: '0.85rem', color: '#4a2c1f', fontWeight: 'bold' }}>{contrast}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={(e) => setContrast(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#d4af37' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#4a2c1f' }}>Saturation</span>
              <span style={{ fontSize: '0.85rem', color: '#4a2c1f', fontWeight: 'bold' }}>{saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={(e) => setSaturation(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#d4af37' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#4a2c1f' }}>Hue Rotate</span>
              <span style={{ fontSize: '0.85rem', color: '#4a2c1f', fontWeight: 'bold' }}>{hueRotate}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={hueRotate}
              onChange={(e) => setHueRotate(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#d4af37' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#4a2c1f' }}>Blur</span>
              <span style={{ fontSize: '0.85rem', color: '#4a2c1f', fontWeight: 'bold' }}>{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#d4af37' }}
            />
          </div>
        </div>

        <div style={{
          marginTop: '15px',
          padding: '12px',
          background: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <p style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', lineHeight: '1.5' }}>
            💡 <strong>Pro Tip:</strong> Layer effects like a professional designer! Combine gradients, images, blend modes, and filters for unique looks.
          </p>
        </div>
      </div>

      {/* Adobe Integration Callout */}
      <div style={{
        background: 'linear-gradient(135deg, #ff0000 0%, #ff4040 100%)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(255, 0, 0, 0.3)'
      }}>
        <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '10px', fontWeight: 'bold' }}>
          🎨 Powered by Professional Tools
        </h4>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.85rem', lineHeight: '1.5' }}>
          Creative controls inspired by industry-leading design software. Express your vision with pro-grade color, gradient, and filter tools.
        </p>
      </div>
    </div>
  );
}