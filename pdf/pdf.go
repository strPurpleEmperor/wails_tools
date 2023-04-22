package pdf

import (
	"changeme/tools"
	"context"
	"fmt"
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/page"
	"github.com/chromedp/chromedp"
	"log"
	"time"
)

type PDF struct {
	pdf    []byte
	img    []byte
	url    string
	title  string
	status bool
}
type ExportPdf struct {
	Pdf    []int8
	Img    []int8
	Url    string
	Title  string
	Status bool
}
type ExportURL struct {
	Name string
	Url  string
}

func GetPDF(url string) ExportPdf {
	// 禁用chrome headless
	opts := append(
		chromedp.DefaultExecAllocatorOptions[:],
	)
	allocCtx, cancel := chromedp.NewExecAllocator(context.Background(), opts...)
	defer cancel()
	ctx, cancel := chromedp.NewContext(
		allocCtx,
	)
	defer cancel()
	var rPDF PDF
	if err := chromedp.Run(ctx, printToPDF(url, &rPDF)); err != nil {
		log.Fatal(err)
	}
	fmt.Println(rPDF.title)
	return ExportPdf{
		Pdf:    tools.Byte2Int(rPDF.pdf),
		Img:    tools.Byte2Int(rPDF.img),
		Url:    rPDF.url,
		Title:  rPDF.title,
		Status: rPDF.status,
	}
}

// print a specific pdf page.
func printToPDF(url string, pdf *PDF) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.Navigate(url),
		chromedp.Sleep(time.Duration(3) * time.Second),
		chromedp.CaptureScreenshot(&pdf.img),
		chromedp.Title(&pdf.title),
		chromedp.ActionFunc(func(ctx context.Context) error {
			buf, _, err := page.PrintToPDF().WithPrintBackground(true).Do(ctx)
			pdf.url = url
			pdf.status = true
			pdf.pdf = buf
			if err != nil {
				pdf.status = false
			}
			return nil
		}),
	}
}

func GetUrl(url string) []ExportURL {
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	// run task list
	var res []ExportURL
	var nodes []*cdp.Node
	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.Sleep(time.Duration(3)*time.Second),
		chromedp.Nodes("a", &nodes, chromedp.ByQueryAll),
	)
	if err != nil {
		log.Fatal(err)
	}
	for _, node := range nodes {
		var name string
		if len(node.Children) > 0 {
			name = node.Children[0].NodeValue
		}
		res = append(res, ExportURL{Name: name, Url: node.AttributeValue("href")})
	}
	return res
}
