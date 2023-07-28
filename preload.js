const { contextBridge, ipcRenderer, IpcInterface } = require('electron');
const html2pdf = require('html2pdf.js');
// 렌더러 프로세스에서 사용할 API 정의
// use window.electron.doThing() in renderer process
contextBridge.exposeInMainWorld(
  'electron',
  {
    toggleDevTool: () => ipcRenderer.send('toggleDevTool'),
    refresh: () => ipcRenderer.send('refresh'),
    getMacAddr: () => {
      const os = require('os');
      const ifaces = os.networkInterfaces();
      const macDic = Object.keys(ifaces).reduce((macDic, iface) => {
        const addresses = {};
        let hasAddresses = false;
        const eth = ifaces[iface]
          .filter((e) => e.family === 'IPv4')
          .map((eth) => {
            if (!eth.internal) {
              addresses[(eth.family || '').toLowerCase()] = eth.address;
              hasAddresses = true;
              if (eth.mac && eth.mac !== '00:00:00:00:00:00') {
                addresses.mac = eth.mac;
              }
            }
            if (hasAddresses) {
              const mac = eth.mac;
              return mac;
            }
          })
        macDic[iface] = eth[0];
        return macDic;
      }, {})

      return macDic;
    },
    getIpAddr: () => {
      const os = require('os');
      const interfaces = os.networkInterfaces();
      const addresses = [];
      for (const k in interfaces) {
        for (const k2 in interfaces[k]) {
          const address = interfaces[k][k2];
          if(address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
          }
        }
      }
      return addresses;
    },
    appScreenshot: async (filePath, format) => await ipcRenderer.invoke('appScreenshot', filePath, format),
    openFolderDialog: () => ipcRenderer.invoke('openFolderDialog'),
    openFileDialog: () => ipcRenderer.invoke('openFileDialog'),
    appPdf: async (filePath, format) => {
      console.log(document.getElementById('bodyEle'));
      html2pdf().from(document.getElementById('bodyEle')).set({
        margin:       1,
        filename:     filePath + 'myfile.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      }).save();
    },
  }
)