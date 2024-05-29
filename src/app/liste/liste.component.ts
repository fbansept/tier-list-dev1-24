import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './liste.component.html',
  styleUrl: './liste.component.scss',
})
export class ListeComponent {
  listeCategories: { nom: string; elements: string[] }[] = [];
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
      { nom: 'Top', elements: [] },
      { nom: 'Bon', elements: [] },
      { nom: 'Moyen', elements: [] },
      { nom: 'Mauvais', elements: [] },
      { nom: 'Horrible', elements: [] },
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
    });

    this.nomCategorieSaisie = '';

    this.sauvegarde();
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
