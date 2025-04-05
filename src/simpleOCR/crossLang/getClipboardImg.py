import sys
from PIL import Image
import io

def get_clipboard_image():
    """跨平台获取剪贴板图片，返回 PIL.Image 对象"""
    if sys.platform == 'win32':
        return _get_clipboard_image_windows()
    elif sys.platform == 'darwin':
        return _get_clipboard_image_mac()
    elif sys.platform.startswith('linux'):
        return _get_clipboard_image_linux()
    else:
        raise NotImplementedError("Unsupported platform")

def _get_clipboard_image_windows():
    """Windows 获取剪贴板图片"""
    import win32clipboard
    try:
        win32clipboard.OpenClipboard()
        if win32clipboard.IsClipboardFormatAvailable(win32clipboard.CF_DIB):
            # 获取位图数据
            clipboard_data = win32clipboard.GetClipboardData(win32clipboard.CF_DIB)
            # 转换为 Pillow 图像
            return Image.open(io.BytesIO(clipboard_data))
        else:
            return None
    finally:
        win32clipboard.CloseClipboard()

def _get_clipboard_image_mac():
    """macOS 获取剪贴板图片"""
    from AppKit import NSPasteboard, NSPasteboardTypePNG
    pasteboard = NSPasteboard.generalPasteboard()
    data = pasteboard.dataForType_(NSPasteboardTypePNG)
    if data:
        return Image.open(io.BytesIO(data.bytes()))
    return None

def _get_clipboard_image_linux():
    """Linux 获取剪贴板图片（依赖 xclip）"""
    import subprocess
    try:
        # 尝试获取剪贴板中的图像数据（PNG 格式）
        p = subprocess.Popen(
            ['xclip', '-selection', 'clipboard', '-t', 'image/png', '-o'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, _ = p.communicate()
        if stdout:
            return Image.open(io.BytesIO(stdout))
    except FileNotFoundError:
        print("Linux 需要安装 xclip: sudo apt install xclip")
    return None

# 示例：获取剪贴板图片并保存
image = get_clipboard_image()
if image:
    image.save("clipboard_image.png")
else:
    print("no image in clipboard!")