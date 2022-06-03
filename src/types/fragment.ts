export default interface IFragment {
   ownerId: string;
   id: string;
   value?: any;
   delete?(): any;
   save?(): Promise<void>;
   getData?(): Promise<any>;
   setData?(data: Buffer): Promise<void>;
   mimeType?(): string;
   isText?(): boolean;
   formats?(): Array<string>;
   isSupportedType?(value: string): boolean | void;
}
