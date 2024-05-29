import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare type Categorie = { nom: string; elements: string[]; edit: boolean };

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss',
})
export class ListeComponent {
  listeCategories: Categorie[] = [];
  urlElementSaisie: string = '';
  nomCategorieSaisie: string = '';

  ngOnInit() {
    const donnees = localStorage.getItem('listeCategories');

    if (donnees != null) {
      this.listeCategories = JSON.parse(donnees);
    } else {
      this.reset();
    }
  }

  reset() {
    this.listeCategories = [
      { nom: 'Top', elements: [], edit: false },
      { nom: 'Bon', elements: [], edit: false },
      { nom: 'Moyen', elements: [], edit: false },
      { nom: 'Mauvais', elements: [], edit: false },
      { nom: 'Horrible', elements: [], edit: false },
    ];
    this.sauvegarde();
  }

  onAjoutElement() {
    this.listeCategories[0].elements.push(this.urlElementSaisie);
    this.urlElementSaisie = '';

    this.sauvegarde();
  }

  onAjoutCategorie() {
    this.listeCategories.push({
      nom: this.nomCategorieSaisie,
      elements: [],
      edit: false,
    });

    this.nomCategorieSaisie = '';

    this.sauvegarde();
  }

  onDoubleClic(indexCategorie: number, evenement: any) {
    this.listeCategories[indexCategorie].edit = true;

    //l'élément cliqué peut être le div entete ou le span du titre
    const elementClique = evenement.target;

    const enTeteClique = elementClique.closest('.entete');

    //on recupere l'input de l'entete clique
    const input = enTeteClique.querySelector('.input-titre');

    //on donne le focus à l'input
    input.focus();
  }

  onEditCategorie(indexCategorie: number) {
    this.listeCategories[indexCategorie].edit = false;

    this.sauvegarde();
  }

  onKeyUpInputCategorie(indexCategorie: number, evenement: KeyboardEvent) {

    if (evenement.code == 'Enter' || evenement.code == 'Escape') {
      this.onEditCategorie(indexCategorie);
    }
  }

  onSuppressionCategorie(indexCategorie: number) {
    //on trouve l'index de la catégorie qui va récupérer tous les élements de la catégorie supprimée
    //il s'agit de la catégorie suivante, sauf si on supprime la dernière catégorie
    const indexCategorieReceptionElements =
      indexCategorie >= this.listeCategories.length - 1
        ? indexCategorie - 1
        : indexCategorie + 1;

    const categorieReceptionElements =
      this.listeCategories[indexCategorieReceptionElements];

    const categorieSupprime = this.listeCategories[indexCategorie];

    //on ajoute tous les élements de la catégorie supprimée
    categorieReceptionElements.elements = [
      ...categorieReceptionElements.elements,
      ...categorieSupprime.elements,
    ];

    //on supprime la catégorie
    this.listeCategories.splice(indexCategorie, 1);
  }

  onSuppressionImage(indexCategorie: number, indexElement: number) {
    this.listeCategories[indexCategorie].elements.splice(indexElement, 1);

    this.sauvegarde();
  }

  onChangementCategorieImage(
    indexCategorie: number,
    indexElement: number,
    augmente: boolean
  ) {
    //on recupère la catégorie où l'élément doit etre déplacé
    const nouvelleCategorie =
      this.listeCategories[augmente ? indexCategorie - 1 : indexCategorie + 1];

    //on copie l'élément déplacé dans la nouvelle catégorie
    nouvelleCategorie.elements.push(
      this.listeCategories[indexCategorie].elements[indexElement]
    );

    //on supprime l'élément déplacé de son anciennne catégorie
    this.listeCategories[indexCategorie].elements.splice(indexElement, 1);

    this.sauvegarde();
  }

  sauvegarde() {
    localStorage.setItem(
      'listeCategories',
      JSON.stringify(this.listeCategories)
    );
  }
}
