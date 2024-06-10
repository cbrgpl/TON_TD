export class FileManager {
  /**
   * Вспомогательная функция для скачивания файлов
   *
   * уже напрямую с использование a[href]
   */
  downloadUsingAHref(fileName: string, content: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = content;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  /**
   * Скачать файл на компьютер пользователя.
   *
   * Можно передавать разные типы скачивания.
   */
  download(fileName: `${string}.${string}`, type: 'blob', content: Blob): void;
  download(fileName: `${string}.csv`, type: 'csv', content: string): void;
  download(fileName: `${string}.json`, type: 'json', content: string | object, pretty: false): void;
  download(fileName: `${string}.json`, type: 'json', content: string | object, space?: number): void;
  download(fileName: string, type: 'blob' | 'csv' | 'json', ...args: any[]): void {
    const scenarios: Record<typeof type, (...args: any) => void> = {
      blob: (content: Blob) => {
        const url = window.URL.createObjectURL(content);
        this.downloadUsingAHref(fileName, url);
      },
      csv: (content: string) => {
        const csv = `data:text/csv;charset=utf-8,${encodeURIComponent(content)}`;
        this.downloadUsingAHref(fileName, csv);
      },
      json: (content: string | object, space: false | number) => {
        const fileContent =
          typeof content === 'string' ? content : JSON.stringify(content, null, typeof space === 'number' ? space : 0);

        const file = new File([fileContent], fileName, {
          type: 'application/json',
        });
        const url = window.URL.createObjectURL(file);
        this.downloadUsingAHref(fileName, url);
      },
    };
    return scenarios[type](...args);
  }

  /**
   * Выгрузить с компьютера юзера во фронт.
   * @param multiple default true
   */
  async upload(multiple = false): Promise<FileList | null> {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    let promiseResolve = null as ((value: FileList | PromiseLike<FileList | null> | null) => void) | null;

    if (multiple) {
      input.setAttribute('multiple', '');
    } else {
      input.removeAttribute('multiple');
    }

    input.addEventListener('input', async () => {
      promiseResolve!(input.files);
      document.body.removeChild(input);
    });

    input.style.opacity = '0';
    input.style.position = 'absolute';
    input.style.pointerEvents = 'none';

    document.body.append(input);

    input.click();

    return new Promise((resolve) => {
      promiseResolve = resolve;
    });
  }
}

export const fileManager = new FileManager();
