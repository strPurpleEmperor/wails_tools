package tools

import (
	"context"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func SaveFileDialog(ctx context.Context, opt runtime.SaveDialogOptions) (string, error) {
	return runtime.SaveFileDialog(ctx, opt)
}

func Int2Byte(data []int) []byte {
	var buf []byte
	for _, val := range data {
		buf = append(buf, uint8(val))
	}
	return buf
}
func Byte2Int(data []byte) []int8 {
	var buf []int8
	for _, val := range data {
		buf = append(buf, int8(val))
	}
	return buf
}
