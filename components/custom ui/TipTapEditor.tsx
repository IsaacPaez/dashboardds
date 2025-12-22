"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { useEffect, useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Undo,
  Redo,
  Palette,
  Type,
  AlignJustify,
  Upload,
  MousePointerClick,
} from "lucide-react";
import { Button } from "../ui/button";
import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";

interface CloudinaryUploadResult {
  event?: string;
  info?: string | {
    secure_url?: string;
  };
}


interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}


// Extensión personalizada para tamaño de fuente
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace('px', ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}px`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  placeholder = "Write your content here...",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showButtonLinkModal, setShowButtonLinkModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedFontSize, setSelectedFontSize] = useState("16");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");
  const [buttonColor, setButtonColor] = useState("#2563eb"); // Azul por defecto como Submit
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff"); // Blanco por defecto para el texto
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const fontSizePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Link.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            href: {
              default: null,
            },
            target: {
              default: this.options.HTMLAttributes.target,
            },
            class: {
              default: null,
            },
            style: {
              default: null,
            },
          };
        },
      }).configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            style: {
              default: null,
              parseHTML: element => element.getAttribute('style'),
              renderHTML: attributes => {
                if (!attributes.style) {
                  return {};
                }
                return {
                  style: attributes.style,
                };
              },
            },
            width: {
              default: null,
              parseHTML: element => element.getAttribute('width'),
              renderHTML: attributes => {
                if (!attributes.width) {
                  return {};
                }
                return {
                  width: attributes.width,
                };
              },
            },
            height: {
              default: null,
              parseHTML: element => element.getAttribute('height'),
              renderHTML: attributes => {
                if (!attributes.height) {
                  return {};
                }
                return {
                  height: attributes.height,
                };
              },
            },
          };
        },
      }).configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
          style: "resize: both; overflow: auto; max-width: 100%; touch-action: manipulation;",
          draggable: "false",
          ondragstart: "return false;",
        },
      }),
      Youtube.configure({
        controls: false,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
        "data-placeholder": placeholder,
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Cerrar los pickers al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showColorPicker && colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (showFontSizePicker && fontSizePickerRef.current && !fontSizePickerRef.current.contains(event.target as Node)) {
        setShowFontSizePicker(false);
      }
    };

    if (showColorPicker || showFontSizePicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showColorPicker, showFontSizePicker]);

  const applyFontSize = (size: string) => {
    if (editor) {
      editor.chain().focus().setFontSize(size).run();
      setSelectedFontSize(size);
      setShowFontSizePicker(false);
    }
  };

  const fontSizes = ["8", "10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "64", "72"];

  // Add visual resize handles for images (Google Docs style)
  useEffect(() => {
    if (!editor) return;

    let selectedImage: HTMLImageElement | null = null;
    let handleContainer: HTMLDivElement | null = null;
    let isResizing = false;
    let currentHandle: string | null = null;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let aspectRatio = 1;

    const updateHandlesPosition = () => {
      if (!selectedImage || !handleContainer) return;

      const rect = selectedImage.getBoundingClientRect();
      
      // Use fixed positioning relative to viewport
      handleContainer.style.left = `${rect.left}px`;
      handleContainer.style.top = `${rect.top}px`;
      handleContainer.style.width = `${rect.width}px`;
      handleContainer.style.height = `${rect.height}px`;
    };

    const createHandles = (img: HTMLImageElement) => {
      // Remove old handles if they exist
      if (handleContainer) {
        handleContainer.remove();
      }

      // Create handle container with fixed positioning relative to viewport
      handleContainer = document.createElement('div');
      handleContainer.className = 'image-resize-handles';
      handleContainer.id = 'tip-tap-image-handles';
      handleContainer.style.position = 'fixed';
      handleContainer.style.pointerEvents = 'none';
      handleContainer.style.zIndex = '99999';
      handleContainer.style.border = '2px solid #3b82f6';
      handleContainer.style.boxSizing = 'border-box';
      handleContainer.style.borderRadius = '4px';

      if (!handleContainer) return;

      // Create 8 handles (4 corners + 4 edges)
      const handles = [
        { pos: 'nw', cursor: 'nwse-resize', top: '-10px', left: '-10px' },
        { pos: 'n', cursor: 'ns-resize', top: '-10px', left: '50%', transform: 'translateX(-50%)' },
        { pos: 'ne', cursor: 'nesw-resize', top: '-10px', right: '-10px' },
        { pos: 'e', cursor: 'ew-resize', top: '50%', right: '-10px', transform: 'translateY(-50%)' },
        { pos: 'se', cursor: 'nwse-resize', bottom: '-10px', right: '-10px' },
        { pos: 's', cursor: 'ns-resize', bottom: '-10px', left: '50%', transform: 'translateX(-50%)' },
        { pos: 'sw', cursor: 'nesw-resize', bottom: '-10px', left: '-10px' },
        { pos: 'w', cursor: 'ew-resize', top: '50%', left: '-10px', transform: 'translateY(-50%)' },
      ];

      handles.forEach(({ pos, cursor, top, left, right, bottom, transform }) => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-handle-${pos}`;
        handle.setAttribute('data-handle', pos);
        handle.style.position = 'absolute';
        handle.style.width = '20px';
        handle.style.height = '20px';
        handle.style.backgroundColor = '#3b82f6';
        handle.style.border = '2px solid white';
        handle.style.borderRadius = '50%';
        handle.style.cursor = cursor;
        handle.style.pointerEvents = 'auto';
        handle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
        handle.style.zIndex = '100000';
        handle.style.transition = 'background-color 0.2s, transform 0.2s';
        
        if (top) handle.style.top = top;
        if (left) handle.style.left = left;
        if (right) handle.style.right = right;
        if (bottom) handle.style.bottom = bottom;
        if (transform) handle.style.transform = transform;

        handle.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          isResizing = true;
          currentHandle = pos;
          startX = e.clientX;
          startY = e.clientY;
          startWidth = img.offsetWidth || img.naturalWidth || img.width || 200;
          startHeight = img.offsetHeight || img.naturalHeight || img.height || 200;
          aspectRatio = startHeight / startWidth;
          
          // Add active class
          handle.style.backgroundColor = '#2563eb';
          handle.style.transform = (transform || '') + ' scale(1.3)';
        });

        handle.addEventListener('mouseenter', () => {
          if (!isResizing) {
            handle.style.backgroundColor = '#2563eb';
            handle.style.transform = (transform || '') + ' scale(1.2)';
          }
        });

        handle.addEventListener('mouseleave', () => {
          if (!isResizing) {
            handle.style.backgroundColor = '#3b82f6';
            handle.style.transform = transform || '';
          }
        });

        handleContainer!.appendChild(handle);
      });

      // Append to body for fixed positioning
      document.body.appendChild(handleContainer);

      updateHandlesPosition();
    };

    const removeHandles = () => {
      if (handleContainer) {
        handleContainer.remove();
        handleContainer = null;
      }
      selectedImage = null;
    };

    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if clicking on a handle - don't process if clicking on handle
      if (target.classList.contains('resize-handle') || target.closest('.resize-handle') || target.closest('#tip-tap-image-handles')) {
        return;
      }

      if (target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove previous selection
        const allImages = editor.view.dom.querySelectorAll('img');
        allImages.forEach(img => {
          if (img !== target) {
            (img as HTMLImageElement).style.outline = '';
            (img as HTMLImageElement).style.outlineOffset = '';
          }
        });
        
        selectedImage = target as HTMLImageElement;
        
        // Add visual selection indicator
        selectedImage.style.outline = '2px solid #3b82f6';
        selectedImage.style.outlineOffset = '2px';
        
        // Small delay to ensure image is rendered
        setTimeout(() => {
          createHandles(selectedImage!);
        }, 10);
        
        return false;
      } else {
        // Remove selection from all images
        const allImages = editor.view.dom.querySelectorAll('img');
        allImages.forEach(img => {
          (img as HTMLImageElement).style.outline = '';
          (img as HTMLImageElement).style.outlineOffset = '';
        });
        removeHandles();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !selectedImage || !currentHandle) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // Calculate new dimensions based on which handle is being dragged
      switch (currentHandle) {
        case 'se': // Bottom-right
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = newWidth * aspectRatio;
          break;
        case 'sw': // Bottom-left
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = newWidth * aspectRatio;
          break;
        case 'ne': // Top-right
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = newWidth * aspectRatio;
          break;
        case 'nw': // Top-left
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = newWidth * aspectRatio;
          break;
        case 'e': // Right edge
          newWidth = Math.max(50, startWidth + deltaX);
          newHeight = newWidth * aspectRatio;
          break;
        case 'w': // Left edge
          newWidth = Math.max(50, startWidth - deltaX);
          newHeight = newWidth * aspectRatio;
          break;
        case 'n': // Top edge
          newHeight = Math.max(50, startHeight - deltaY);
          newWidth = newHeight / aspectRatio;
          break;
        case 's': // Bottom edge
          newHeight = Math.max(50, startHeight + deltaY);
          newWidth = newHeight / aspectRatio;
          break;
      }

      // Apply new size
      selectedImage.style.width = `${newWidth}px`;
      selectedImage.style.height = `${newHeight}px`;
      selectedImage.setAttribute('width', `${newWidth}`);
      selectedImage.setAttribute('height', `${newHeight}`);

      // Update handles position
      updateHandlesPosition();
    };

    const handleMouseUp = () => {
      if (isResizing && selectedImage) {
        // Reset handle styles
        if (handleContainer) {
          const handles = handleContainer.querySelectorAll('.resize-handle');
          handles.forEach(handle => {
            const pos = (handle as HTMLElement).getAttribute('data-handle');
            const handlesConfig = [
              { pos: 'nw', transform: '' },
              { pos: 'n', transform: 'translateX(-50%)' },
              { pos: 'ne', transform: '' },
              { pos: 'e', transform: 'translateY(-50%)' },
              { pos: 'se', transform: '' },
              { pos: 's', transform: 'translateX(-50%)' },
              { pos: 'sw', transform: '' },
              { pos: 'w', transform: 'translateY(-50%)' },
            ];
            const config = handlesConfig.find(h => h.pos === pos);
            (handle as HTMLElement).style.backgroundColor = '#3b82f6';
            (handle as HTMLElement).style.transform = config?.transform || '';
          });
        }
        
        // Update TipTap attributes to ensure persistence
        // We need to find the node position in the document
        try {
          // This approach is more reliable to find the position
          const view = editor.view;
          const pos = view.posAtDOM(selectedImage, 0);
          
          if (typeof pos === 'number') {
            const { width, height } = selectedImage.style;
            
            // Apply the update in a transaction
            editor.chain()
              .setNodeSelection(pos)
              .updateAttributes('image', {
                width: width,
                height: height,
                style: `width: ${width}; height: ${height};`
              })
              .run();
          }
        } catch (error) {
          console.error("Error updating image attributes:", error);
        }
        
        // Save changes to editor
        onChange(editor.getHTML());
        
        // Update handles position after resize
        updateHandlesPosition();
      }
      isResizing = false;
      currentHandle = null;
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleImageClick, true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Update handles position on window resize and scroll
    const handleResize = () => {
      if (selectedImage && handleContainer) {
        updateHandlesPosition();
      }
    };
    
    const handleScroll = () => {
      if (selectedImage && handleContainer) {
        updateHandlesPosition();
      }
    };
    
    // Update handles on editor content changes (e.g. alignment changes)
    const handleEditorUpdate = () => {
      if (selectedImage && handleContainer) {
        // Small delay to allow DOM to update
        setTimeout(updateHandlesPosition, 0);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);
    
    // Also listen to editor scroll
    editorElement.addEventListener('scroll', handleScroll);
    
    // Listen to editor updates
    editor.on('update', handleEditorUpdate);
    editor.on('selectionUpdate', handleEditorUpdate);
    editor.on('transaction', handleEditorUpdate);

    return () => {
      editorElement.removeEventListener('click', handleImageClick, true);
      editorElement.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      
      // Remove editor listeners
      editor.off('update', handleEditorUpdate);
      editor.off('selectionUpdate', handleEditorUpdate);
      editor.off('transaction', handleEditorUpdate);
      
      removeHandles();
    };
  }, [editor, onChange]);



  if (!isMounted || !editor) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <style jsx>{`
          .ProseMirror img {
            transition: none !important;
            transform: none !important;
            display: inline-block;
            max-width: 100%;
            cursor: nwse-resize;
            user-select: none !important;
            touch-action: none !important;
          }
          .ProseMirror img:hover {
            transform: none !important;
            scale: 1 !important;
            zoom: 1 !important;
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
          }
          .ProseMirror img:active {
            transform: none !important;
            scale: 1 !important;
            zoom: 1 !important;
          }
        `}</style>
        <div className="bg-gray-50 border-b border-gray-300 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-white min-h-[300px] p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  const colors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#A52A2A", "#808080", "#000080", "#008000",
  ];

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
    setSelectedColor(color);
  };

  const handleImageUpload = (result: CloudinaryUploadResult) => {
    if (result.event === "success") {
      const info = typeof result?.info === 'object' && result.info?.secure_url
        ? result.info
        : typeof result?.info === 'string'
          ? JSON.parse(result.info)
          : null;

      if (info?.secure_url) {
        const url = info.secure_url;
        const resourceType = info.resource_type || 'image'; // "image" or "video"

        if (resourceType === "video") {
          editor.chain().focus().setYoutubeVideo({ src: url }).run();
          toast.success("Video added successfully");
        } else {
          editor.chain().focus().setImage({ src: url }).run();
          toast.success("Image added successfully");
          // Auto-select the newly added image after a short delay
          setTimeout(() => {
            const images = editor.view.dom.querySelectorAll('img');
            if (images.length > 0) {
              const lastImage = images[images.length - 1] as HTMLImageElement;
              lastImage.click();
            }
          }, 100);
        }
      }
    }
  };



  const confirmImageUrl = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      toast.success("Image added successfully");
      setShowImageUrlModal(false);
      setImageUrl("");
      // Auto-select the newly added image after a short delay
      setTimeout(() => {
        const images = editor?.view.dom.querySelectorAll('img');
        if (images && images.length > 0) {
          const lastImage = images[images.length - 1] as HTMLImageElement;
          lastImage.click();
        }
      }, 100);
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setShowLinkModal(true);
  };

  const confirmLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setShowLinkModal(false);
    setLinkUrl("");
  };

  const addButtonLink = () => {
    setButtonText("");
    setButtonUrl("");
    setButtonColor("#2563eb"); // Resetear a azul por defecto
    setButtonTextColor("#ffffff"); // Resetear a blanco por defecto
    setShowButtonLinkModal(true);
  };

  const confirmButtonLink = () => {
    if (buttonUrl && buttonText) {
      // Insertamos el botón seguido de un espacio para sacar el cursor del enlace
      const buttonHtml = `<a href="${buttonUrl}" target="_blank" class="custom-button-link" style="display: inline-block; padding: 0.5rem 1rem; background-color: ${buttonColor} !important; color: ${buttonTextColor} !important; border-radius: 0.5rem; font-weight: 500; text-decoration: none; transition: all 0.2s; margin: 0.5rem 0; cursor: pointer;">${buttonText}</a>&nbsp;`;
      editor.chain().focus().insertContent(buttonHtml).run();
      toast.success("Button added successfully");
      setShowButtonLinkModal(false);
      setButtonText("");
      setButtonUrl("");
      setButtonColor("#2563eb");
      setButtonTextColor("#ffffff");
    }
  };

  return (
    <div className="border-2 border-blue-300 rounded-lg overflow-hidden shadow-lg">
      <style jsx global>{`
        .ProseMirror img {
          transition: none !important;
          transform: none !important;
          display: inline-block;
          max-width: 100%;
          cursor: pointer;
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          pointer-events: auto !important;
          touch-action: manipulation !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
          zoom: 1 !important;
          will-change: auto !important;
          image-rendering: auto !important;
        }
        .ProseMirror img:hover {
          transform: none !important;
          scale: 1 !important;
          zoom: 1 !important;
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        .ProseMirror img:active {
          transform: none !important;
          scale: 1 !important;
          zoom: 1 !important;
        }
        .ProseMirror img:focus {
          transform: none !important;
          scale: 1 !important;
          zoom: 1 !important;
        }
        .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
          transform: none !important;
          zoom: 1 !important;
        }
        .ProseMirror {
          touch-action: manipulation !important;
        }
        #tip-tap-image-handles {
          pointer-events: none !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        #tip-tap-image-handles .resize-handle {
          pointer-events: auto !important;
          transition: all 0.2s ease !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        #tip-tap-image-handles .resize-handle:hover {
          background-color: #2563eb !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6) !important;
        }
        #tip-tap-image-handles .resize-handle:active {
          background-color: #1d4ed8 !important;
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.8) !important;
        }
      `}</style>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
        {/* Text Formatting */}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="font-bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("underline") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("strike") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Font Size Picker */}
        <div className="relative" ref={fontSizePickerRef}>
          <Button
            type="button"
            variant={showFontSizePicker ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFontSizePicker(!showFontSizePicker)}
            className="flex items-center gap-2 px-3"
          >
            <Type className="h-4 w-4" />
            <span className="text-xs font-medium">{selectedFontSize}px</span>
          </Button>
          {showFontSizePicker && (
            <>
              {/* Overlay para cerrar al hacer clic fuera */}
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setShowFontSizePicker(false)}
              />
              {/* Modal de tamaño de fuente */}
              <div className="absolute top-full left-0 mt-2 bg-white border-2 border-blue-400 rounded-lg shadow-xl p-3 z-[9999] min-w-[240px]">
                <div className="mb-2">
                  <h3 className="text-xs font-bold text-gray-700 mb-2">Font Size</h3>
                  <div className="grid grid-cols-5 gap-1.5">
                    {fontSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => applyFontSize(size)}
                        className={`px-2 py-1.5 rounded border transition-all hover:scale-105 text-xs font-medium ${selectedFontSize === size
                          ? "border-blue-600 bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                          : "border-gray-300 hover:border-blue-400 bg-white text-gray-700"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Custom (px):
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="8"
                      max="200"
                      value={selectedFontSize}
                      onChange={(e) => {
                        const size = e.target.value;
                        if (size && parseInt(size) >= 8 && parseInt(size) <= 200) {
                          setSelectedFontSize(size);
                          applyFontSize(size);
                        }
                      }}
                      placeholder="16"
                      className="flex-1 px-2 py-1.5 border-2 border-gray-300 rounded text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedFontSize && parseInt(selectedFontSize) >= 8 && parseInt(selectedFontSize) <= 200) {
                          applyFontSize(selectedFontSize);
                        }
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFontSizePicker(false)}
                  className="mt-2 w-full px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium text-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Color Picker */}
        <div className="relative" ref={colorPickerRef}>
          <Button
            type="button"
            variant={showColorPicker ? "default" : "outline"}
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-2 px-3"
          >
            <Palette className="h-4 w-4" />
            <span className="text-xs font-medium">Color</span>
            <div
              className="w-5 h-5 rounded border-2 border-gray-400 shadow-sm"
              style={{ backgroundColor: selectedColor }}
            />
          </Button>
          {showColorPicker && (
            <>
              {/* Overlay para cerrar al hacer clic fuera */}
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setShowColorPicker(false)}
              />
              {/* Modal de colores */}
              <div className="absolute top-full left-0 mt-2 bg-white border-2 border-blue-400 rounded-xl shadow-2xl p-4 z-[9999] min-w-[280px]">
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Select Text Color</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {colors.map((color) => {
                      const isSelected = selectedColor === color;
                      const isWhite = color === "#FFFFFF";
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => applyColor(color)}
                          className={`w-10 h-10 rounded-lg transition-all transform hover:scale-110 hover:shadow-lg ${isSelected
                            ? "ring-2 ring-blue-300"
                            : ""
                            }`}
                          style={{
                            backgroundColor: color,
                            border: isSelected
                              ? "3px solid #2563eb"
                              : isWhite
                                ? "3px solid #000000"
                                : "3px solid #000000",
                            boxShadow: isWhite && !isSelected ? "inset 0 0 0 1px rgba(0,0,0,0.1)" : undefined
                          }}
                          title={color}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Custom Color:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => {
                        setSelectedColor(e.target.value);
                        applyColor(e.target.value);
                      }}
                      className="w-12 h-10 rounded border-2 border-black cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => {
                        const color = e.target.value;
                        if (/^#[0-9A-F]{6}$/i.test(color)) {
                          setSelectedColor(color);
                          applyColor(color);
                        }
                      }}
                      placeholder="#000000"
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(false)}
                  className="mt-3 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: "center" }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: "right" }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: "justify" }) ? "default" : "outline"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link & Button Link */}
        <Button
          type="button"
          variant={editor.isActive("link") ? "default" : "outline"}
          size="sm"
          onClick={setLink}
          title="Add text link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addButtonLink}
          title="Add button with link"
        >
          <MousePointerClick className="h-4 w-4" />
        </Button>

        {/* Cloudinary Image/Video Upload */}
        <CldUploadWidget
          uploadPreset="uznprz18"
          onSuccess={handleImageUpload}
          options={{
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            sources: ['local', 'url', 'camera', 'google_drive', 'dropbox'],
            multiple: false,
            maxFiles: 1,
            clientAllowedFormats: ['image', 'video'],
            maxImageFileSize: 5000000,
            maxVideoFileSize: 100000000,
            maxImageWidth: 2000,
            maxImageHeight: 2000,
            showPoweredBy: false,
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (open) {
                  open();
                }
              }}
              title="Upload image or video from Cloudinary"
            >
              <Upload className="h-4 w-4" />
            </Button>
          )}
        </CldUploadWidget>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="bg-white min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      {/* Image URL Modal */}
      {showImageUrlModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[10000]"
            onClick={() => {
              setShowImageUrlModal(false);
              setImageUrl("");
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[10001]">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Image by URL</h3>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    confirmImageUrl();
                  }
                }}
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowImageUrlModal(false);
                    setImageUrl("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={confirmImageUrl}
                >
                  Add Image
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Link Modal */}
      {showLinkModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[10000]"
            onClick={() => {
              setShowLinkModal(false);
              setLinkUrl("");
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[10001]">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add/Edit Link</h3>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    confirmLink();
                  }
                }}
                autoFocus
              />
              <p className="text-sm text-gray-500 mb-4">Leave empty to remove link</p>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowLinkModal(false);
                    setLinkUrl("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={confirmLink}
                  className="bg-blue-600 text-white"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </>
      )}



      {/* Button Link Modal */}
      {showButtonLinkModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[10000]"
            onClick={() => {
              setShowButtonLinkModal(false);
              setButtonText("");
              setButtonUrl("");
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[10001]">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Button</h3>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Button Text:
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="Click Here"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && buttonText && buttonUrl) {
                      confirmButtonLink();
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link URL:
                </label>
                <input
                  type="text"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && buttonText && buttonUrl) {
                      confirmButtonLink();
                    }
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Background Color:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    placeholder="#2563eb"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div
                    className="w-10 h-10 rounded border-2 border-gray-300"
                    style={{ backgroundColor: buttonColor }}
                  />
                </div>
                <p className="text-sm text-gray-500">Default: Blue (matches Submit button)</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Text Color:
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={buttonTextColor}
                    onChange={(e) => setButtonTextColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={buttonTextColor}
                    onChange={(e) => setButtonTextColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div
                    className="w-12 h-10 rounded border-2 border-gray-300"
                    style={{ backgroundColor: buttonTextColor }}
                  />
                </div>
                <p className="text-sm text-gray-500">Default: White</p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowButtonLinkModal(false);
                    setButtonText("");
                    setButtonUrl("");
                    setButtonColor("#2563eb");
                    setButtonTextColor("#ffffff");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={confirmButtonLink}
                  className="bg-blue-600 text-white"
                  disabled={!buttonText || !buttonUrl}
                >
                  Add Button
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div >
  );
};

export default TipTapEditor;
