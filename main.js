const { app, BrowserWindow, ipcMain, globalShortcut  } = require('electron')
// include the Node.js 'path' module at the top of your file
const path = require('path')
const PDFDocument = require('pdfkit');
const PDFMerge = require('pdfmerge');
const {createWriteStream, unlinkSync} = require("fs");
const fs = require("fs");

let win;

const createWindow = () => {

  console.log(path.join(__dirname, 'preload.js'));
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // 컨텍스트 격리 활성화
      enableRemoteModule: false, // 원격 모듈 비활성화
    }
  })
  win.webContents.openDevTools()

  win.loadFile('index.html');
}

// Electron 애플리케이션이 준비되었을 때 실행되는 함수
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 앱 종료 시 등록된 단축키 해제
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});


//렌더러프로세스에서 보내는 메시지 처리
ipcMain.on('toggleDevTool', (event, arg)=> {
  //디버기 툴 토글(on/off)
  win.webContents.toggleDevTools()
})
ipcMain.on('refresh', (event, arg)=> {
  //페이지 갱신
  win.reload();
})

ipcMain.on('screen-shot', async (event, filePath, format)=> {
  const capture = await win.capturePage();
  let buffer;
  if (format == 'png') {
    buffer = capture.toPNG();
  } else if (format == 'jpg') {
    buffer = capture.toJPEG();
  } else {
    return false;
  }
  fs.writeFile(filePath, buffer, () => { });
  return true;
});

function createPDFsAndMerge() {
  // 첫 번째 PDF 문서 생성
  const doc1 = new PDFDocument();
  doc1.pipe(createWriteStream('document1.pdf'));
  doc1.text('This is Document 1');
  doc1.end();

  // 두 번째 PDF 문서 생성
  const doc2 = new PDFDocument();
  doc2.pipe(createWriteStream('document2.pdf'));
  doc2.text('This is Document 2');
  doc2.end();

  // 두 개의 문서를 병합하여 최종 PDF 생성
  const mergedPDFPath = 'merged_document.pdf';
  PDFMerge(['document1.pdf', 'document2.pdf'], mergedPDFPath)
    .then(() => {
      // 병합된 PDF 문서가 생성되었으므로 기존 문서 파일 삭제
      unlinkSync('document1.pdf');
      unlinkSync('document2.pdf');

      // 병합된 PDF 문서를 여는 Electron 창 생성
      const win = new BrowserWindow();
      win.loadURL(`file://${__dirname}/${mergedPDFPath}`).then(r => console.log(r));
    })
    .catch(error => {
      console.error('Failed to merge PDFs:', error);
    });
}