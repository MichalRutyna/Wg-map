interface DataContainer<T> {
    children: Map<string, T>

    addChild(child: T): void;
    getChild(id: string): T | undefined;
}

export abstract class BaseDataContainer<T extends { id: string }>
    implements DataContainer<T>
{
    children = new Map<string, T>();

    addChild(child: T): void {
        this.children.set(child.id, child);
    }

    getChild(id: string): T | undefined {
        return this.children.get(id);
    }
}

type Constructor<T> = new (...args: any[]) => T;

function deserialize<T>(
    cls: Constructor<T>,
    data: unknown
): T {
    // @ts-ignore
    return Object.assign(new cls(), data);
}

export async function fetchIntoContainer<T>(
    path: string,
    cls: Constructor<T>,
    container: DataContainer<T>
): Promise<void> {
    await fetch(path)
        .then(response => response.json())
        .then((items): void => {
            items.forEach((json: object) => container.addChild(deserialize(cls, json)));
        });
}
