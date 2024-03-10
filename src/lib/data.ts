export type Episode = {
    image: string;
    speakers: string;
    title: string;
    summary: string;
    hash: string;
};

export const epicenter: Episode[] = [
    {
        image:
            'https://image.simplecastcdn.com/images/3fd3384e-ef77-4fde-81aa-9b946a76e280/1f42ec18-6c52-4e76-a9dd-53a644c9c194/youtube-jasper-de-gooijer.jpg',
        speakers: 'Jasper De Goojier',
        title: 'SEDA – Intent-Based Modular Data Layer',
        summary:
            'We were joined by Jasper De Goojier, co-founder of SEDA Protocol, to discuss the oracle landscape and how SEDA aims to decentralise it and make data access permissionless.',
        hash: '0x3eC0A3953A155B83395bE190a387f4b5fF29Dcc6'
    },
    {
        image:
            'https://image.simplecastcdn.com/images/3fd3384e-ef77-4fde-81aa-9b946a76e280/842c9506-3172-4677-9ec6-1093e89f481a/youtube-anish.jpg',
        speakers: 'Anish Mohammed',
        title: 'Panther Protocol – Zero-Knowledge Compliant Privacy in DeFi',
        summary:
            'We were joined by Anish Mohammed, co-founder & CTO of Panther Protocol, to discuss the importance of compliant privacy for on-chain transactions, powered by zero knowledge technology.',
        hash: '0x53EB1EB37b3DDEacB3627Ea670256412Cd7dC419'
    },
    {
        image:
            'https://image.simplecastcdn.com/images/3fd3384e-ef77-4fde-81aa-9b946a76e280/fddc8e31-25dd-4e53-96a1-3156cc15d44d/gil-binder-yair-cleper-audiogram-youtube.jpg',
        speakers: 'Gil Binder & Yair Cleper',
        title: 'Lava Network – Decentralising RPC and Node Providers',
        summary:
            'We were joined by Gil and Yair to discuss Lava Network’s decentralised marketplace for RPC and node providers in the modular, multi-chain landscape.',
        hash: '0x393655779253857A99dc9CfFf7d41627698F9762'
    },
    {
        image:
            'https://image.simplecastcdn.com/images/3fd3384e-ef77-4fde-81aa-9b946a76e280/d271a0c3-9210-40c5-b187-f4ad86efd8a2/youtube-zhiming-yang.jpg',
        speakers: 'Zhiming Yang',
        title: 'Orbit Markets – Crypto Derivatives and Structured Products',
        summary:
            'We were joined by Zhiming Yang, co-founder of Orbit Markets, to discuss crypto derivatives and how TradFi expertise applies to customising structured products for crypto markets.',
        hash: '0xe7235a611194ffC2db70767f7c52Ffe3Eb232260'
    }
];