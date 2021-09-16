import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Image {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface ImageQuery {
  after: string;
  data: Array<Image>;
}

export default function Home(): JSX.Element {
  const getImageList = async ({ pageParam = null }): Promise<ImageQuery> => {
    const { data } = await api.get('/api/images', {
      params: { after: pageParam },
    });
    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    // TODO AXIOS REQUEST WITH PARAM
    getImageList,
    // TODO GET AND RETURN NEXT PAGE PARAM
    {
      getNextPageParam: lastReq => lastReq?.after || null,
    }
  );

  const formattedData = useMemo(() => {
    return data?.pages
      .map(item => {
        return item.data;
      })
      .flat();
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage ? (
          <Button onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        ) : (
          <></>
        )}
      </Box>
    </>
  );
}
