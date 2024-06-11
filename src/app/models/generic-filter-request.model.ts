export class GenericFilterRequest {
    numeroPagina: number = 1;
    cantidad: number = 3;
    filtros: ItemFilter[] = [];
}


export class ItemFilter {
    name: string = "";
    value: string = "";
}