declare interface ObservableComponent<P, O> extends React.StatelessComponent<P> {
    __eventStream: O;
}

declare type Component = React.ComponentClass<any> | React.StatelessComponent<any> | string

declare interface AdapterDefinition<Subject, Observable> {
    subjectFactory: () => Subject,
    emit: (subject: Subject, v: any) => void,
    toObservable: (subject: Subject) => Observable,
    filter: (observable: Observable, predicate: (v: any) => boolean) => Observable,
}
