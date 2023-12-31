import React, {useState} from 'react';
import {
  Container,
  ProfileArea,
  ProfileAreaBackground,
  ProfileButton,
  ProfileEmail,
  ProfileName,
  ProfileOptions,
  ProfilePhoto,
  ProfilePhotoArea,
  PurchaseArea,
  PurchaseItemDivisor,
  PurchaseList,
} from './styles';
import {NavigationType, PurchaseType, ScreenProps} from '@src/types';
import {useStorage} from '@src/hooks/storage';
import {useToastApp} from '@src/hooks/toast-app';
import {Purchase} from '@components/Purchase';
import {StatusBar} from 'react-native';
import {PurchaseModal} from '@components/Modals/PurchaseModal';
import {useSession} from '@src/hooks/session';

export const ProfileScreen = ({navigation}: ScreenProps): JSX.Element => {
  const [purchases, setPurchases] = useState<Array<PurchaseType>>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<
    PurchaseType | undefined
  >();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const {getPurchases} = useStorage();
  const {toastInfo} = useToastApp();
  const {signOut, userData} = useSession();

  const handleLoadPurchases = () => {
    const purchasesHistoric = getPurchases();
    if (purchasesHistoric.length === 0) {
      toastInfo('Não há nenhuma compra registrada nesse app');
      return;
    }
    setPurchases(purchasesHistoric);
    toastInfo('Compras carregadas com sucesso');
  };

  const handleShowPurchaseModal = (index: number) => {
    setSelectedPurchase(purchases[index]);
    setShowPurchaseModal(true);
  };

  return (
    <Container>
      <StatusBar backgroundColor="rgba(0, 0, 0, 0)" translucent={true} />
      {selectedPurchase && (
        <PurchaseModal
          closeModal={() => setShowPurchaseModal(false)}
          showModal={showPurchaseModal}
          purchase={selectedPurchase}
        />
      )}
      <ProfileArea>
        <ProfileAreaBackground
          source={require('../../assets/profile_view_bg.png')}
          resizeMode="cover"
          imageStyle={{
            opacity: 0.4,
          }}>
          <ProfilePhotoArea>
            <ProfilePhoto
              source={
                userData?.profilePhoto
                  ? {
                      uri: userData.profilePhoto,
                    }
                  : require('../../assets/logo_externato.png')
              }
            />
          </ProfilePhotoArea>
          <ProfileName>{userData?.name ?? 'Sem nome'}</ProfileName>
          <ProfileEmail>{userData?.email ?? 'Sem email'}</ProfileEmail>
        </ProfileAreaBackground>
      </ProfileArea>
      <ProfileOptions>
        <ProfileButton
          name="Início"
          onPress={() => navigation?.navigate(NavigationType.HOME)}
        />
        <ProfileButton name="Sair" onPress={signOut} />
      </ProfileOptions>
      <PurchaseArea>
        <ProfileButton name="Carregar Compras" onPress={handleLoadPurchases} />
        <PurchaseList
          data={purchases}
          renderItem={it => (
            <Purchase
              key={it.index}
              puchase={it.item}
              onPress={() => handleShowPurchaseModal(it.index)}
            />
          )}
          ItemSeparatorComponent={PurchaseItemDivisor}
        />
        <ProfileButton
          name="Relatorio"
          onPress={() => navigation?.navigate(NavigationType.DASHBOARD)}
        />
      </PurchaseArea>
    </Container>
  );
};
