package main

import (
	"changeme/pdf"
	"changeme/tools"
	"context"
	"fmt"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
)

// App struct
type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Greet(name string) string {
	return name
}

func (a *App) PrintPDF(url string) pdf.ExportPdf {
	return pdf.GetPDF(url)
}
func (a *App) SaveFileDialog(opt runtime.SaveDialogOptions) (string, error) {
	return tools.SaveFileDialog(a.ctx, opt)
}

func (a *App) SaveFile(name string, data []int) bool {
	if err := os.WriteFile(name, tools.Int2Byte(data), 0777); err != nil {
		return false
	}
	return true
}

func (a *App) GetUrls(url string) []pdf.ExportURL {
	return pdf.GetUrl(url)
}
func (a *App) SaveFileByString(name string, data string) bool {
	file, err := os.OpenFile(name, os.O_CREATE, 0777)
	if err != nil {
		return false
	}
	_, err = file.WriteString(data)
	if err != nil {
		return false
	}
	return true
}

func (a *App) OpenDirectoryDialog(opt runtime.OpenDialogOptions) (string, error) {
	return runtime.OpenDirectoryDialog(a.ctx, opt)
}

func (a *App) ReadDirByPath(name string) ([]string, error) {
	var names []string
	dir, err := os.ReadDir(name)
	if err == nil {
		for _, entry := range dir {
			names = append(names, entry.Name())
		}
	}
	fmt.Println(dir)
	return names, err
}

func (a *App) RenameFile(path string, newPath string) error {
	return os.Rename(path, newPath)
}
