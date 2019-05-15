import { Component } from '@angular/core';
import { BoxPage } from '../box/box';
import { SpherePage } from '../sphere/sphere';
import { CylinderPage } from '../cylinder/cylinder';
import { GuardaropaPage } from '../guardaropa/guardaropa';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  private tabBox: any;
  private tabSphere: any;
  private tabCylinder: any;
  private tabGuardaropa: any;

  constructor() {
    this.tabBox = BoxPage;
    this.tabSphere = SpherePage;
    this.tabCylinder = CylinderPage;
    this.tabGuardaropa = GuardaropaPage;
  }
}
