package main

import (
	"context"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) ReadFile() (string, error) {
	selection, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{ // open file open dialog
		Title: "Open Markdown File", // title of the dialog box
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Markdown (*.md)",
				Pattern:     "*.md",
			},
		},
	})
	if err != nil {
		return "", err
	}
	if selection == "" {
		return "", nil
	}
	data, err := os.ReadFile(selection) // load whole file
	if err != nil {
		return "", err
	}
	return string(data), nil
}
func (a *App) WriteFile(content string) (string, error) {
	selection, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{ // open save dialog
		Title:           "Save Markdown file", //title of the dialog box
		DefaultFilename: "markdown.md",        //default name of the file to be saved
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Markdown (* md)", // show only markdown files
				Pattern:     "*.md",            // extension .md
			},
		},
	})
	if err != nil {
		return "", err
	}

	if selection == "" {
		return "Cancelled", nil
	}
	err = os.WriteFile(selection, []byte(content), 0644)
	if err != nil {
		return "", err
	}
	return "File saved successfully!", nil
}
