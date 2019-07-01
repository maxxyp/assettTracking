export interface ISchemaLoader {
   getSchema(name: string) : Promise<tv4.JsonSchema>;
}
